const Graph = require('graphology');
const { allSimplePaths } = require('graphology-simple-path');
const { _create:createNotification } = require('./notification.controller');

const User = require('../models/User');
const Account = require('../models/Account');
const Payment = require('../models/Payment');
const Endorsement = require('../models/Endorsement');
const Paylog = require('../models/Paylog');

let graph;

const buildGraph = async () => {
  graph = new Graph();
  const users = await User.find();
  for (let user of users) {
    graph.addNode(user.id, {
      ...user._doc
    });
  }
  // layout manually
  // graph.nodes().forEach((node, i) => {
  //   const angle = (i * 2 * Math.PI) / graph.order;
  //   graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
  //   graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
  // });
  const endorsements = await Endorsement.find();
  endorsements.forEach(endorsement => {
    graph.mergeEdge(endorsement.recipientId, endorsement.endorserId, { limit: endorsement.weight });
  })
  const paylogs = await Paylog.find().populate('paymentId').exec();
  paylogs.forEach(paylog => {
    if(paylog.paymentId.status === 'Completed') {
      // increase limit for amount which you got paid
      if(graph.hasEdge(paylog.recipient, paylog.payer))
        graph.updateEdgeAttribute(paylog.recipient, paylog.payer, 'limit', limit => (limit || 0) + paylog.amount);
      else
        graph.mergeEdge(paylog.recipient, paylog.payer, { limit: paylog.amount });

      // decrease limit for amount which you paid
      if(graph.hasEdge(paylog.payer, paylog.recipient))
        graph.updateEdgeAttribute(paylog.payer, paylog.recipient, 'limit', limit => (limit || 0) - paylog.amount);
      else
        graph.mergeEdge(paylog.payer, paylog.recipient, { limit: -paylog.amount });
    }
  })
}

exports.getGraph = async (req, res, next) => {
  try {
    await buildGraph();
    res.send(graph);
  }
  catch(err) {
    next(err);
  }
}

exports.getMaxLimit = async (req, res, next) => {
  const { recipient } = req.params;
  const sender = req.user._id;
  try {
    const result =  await this._getMaxFlow(sender, recipient)
    if(result.success) {
      res.send({ maxLimit: result.maxLimit, paylogs: result.paylogs });
    }
    else {
      res.status(400).send(result.errors);
    }
  }
  catch(error) {
    next(error);
  }
}

exports.pay = async (req, res, next) => {
  const { recipient, amount, memo } = req.body;
  const payer = req.user._id;
  let payment;

  try {
    payment = await Payment.create({ amount, memo, payer, recipient });

    const result = await this._getMaxFlow(payer, recipient, amount);
    if(result.success) {
      try {
        await Paylog.insertMany(result.paylogs.map(paylog => ({ ...paylog, paymentId: payment._id })), { ordered: false });

        payment.status = 'Completed';
        payment.save();

        // Notify
        const notifyText = `${req.user.username} paid you the amount of ${amount}(V.H.).`;
        const notification = await createNotification('PAYMENT', req.user._id, recipient, amount, notifyText);
        global.io.emit('newNotification', notification);

        res.send({ success: true, paylogs: result.paylogs })
      }
      catch(error) {
        payment.status = 'Failed';
        payment.save();
        console.log('add paylog error:', error)
        next(error);
      }
    }
    else {
      payment.status = 'Failed';
      payment.save();
      res.status(400).send(result.errors);
    }
  }
  catch(err) {
    if(payment) {
      payment.status = 'Failed';
      payment.save();
    }
    console.log('pay error:', err);
    next(err);
  }
}

exports._getMaxFlow = async (sender, recipient, amount = null) => {
  await buildGraph();
  if(!graph.hasNode(recipient)) {
    return {
      success: false,
      errors: {
        recipient: "This recipient has not any account"
      }
    }
  }

  if(sender === recipient) {
    return {
      success: false,
      errors: {
        recipient: "You cannot send to yourself."
      }
    }
  }

  let paths = allSimplePaths(graph, sender, recipient);
  console.log(paths);
  // TODO sort for balancing routes

  let maxLimit = 0;
  let finished = false;
  for (const path of paths) {
    console.log(path.join('->'))
    let min;
    for(let i=0; i<path.length-1; i++) {
      let limit =
        (graph.hasEdge(path[i], path[i+1]) && graph.getEdgeAttribute(path[i], path[i+1], 'limit') ? parseFloat(graph.getEdgeAttribute(path[i], path[i+1], 'limit')) : 0)
        - (graph.hasEdge(path[i], path[i+1]) && graph.getEdgeAttribute(path[i], path[i+1], 'tempPay') ? parseFloat(graph.getEdgeAttribute(path[i], path[i+1], 'tempPay')) : 0)
      if(i === 0) min = limit;
      else min = min < limit ? min : limit
      console.log(limit)
    }

    if(amount && amount - maxLimit < min) {
      min = amount - maxLimit;
      finished = true;
    }

    for(let i=0; i<path.length-1; i++) {
      let tempPayAmount = (graph.hasEdge(path[i], path[i+1]) && graph.getEdgeAttribute(path[i], path[i+1], 'tempPay') ? parseFloat(graph.getEdgeAttribute(path[i], path[i+1], 'tempPay')) : 0) + min;
      if(tempPayAmount > 0) graph.setEdgeAttribute(path[i], path[i+1], 'tempPay', tempPayAmount)
    }
    console.log("min:", min);
    maxLimit += min;
    if(finished) break;
  }
  console.log("maxLimit:", maxLimit)

  if(amount > maxLimit) return {
    success: false,
    errors: {
      amount: `You can send up to ${maxLimit}VH.`
    }
  }

  const paylogs = graph.edges().filter(edge => graph.hasEdgeAttribute(edge, 'tempPay')).map(edge => ({payer: graph.source(edge), recipient: graph.target(edge), amount: graph.getEdgeAttribute(edge, "tempPay")}))

  return { success: true, maxLimit, paylogs };
}
