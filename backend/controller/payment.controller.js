const Graph = require('graphology');
const { allSimplePaths } = require('graphology-simple-path');

const Account = require('../models/Account');
const Payment = require('../models/Payment');
const Endorsement = require('../models/Endorsement');
const Paylog = require('../models/Paylog');

let graph;

const buildGraph = async () => {
  graph = new Graph();
  const endorsements = await Endorsement.find();
  endorsements.forEach(endorsement => {
    graph.mergeEdge(endorsement.recipientId, endorsement.endorserId, { trust: endorsement.weight });
  })
  const paylogs = await Paylog.find().populate('paymentId').exec();
  paylogs.forEach(paylog => {
    if(paylog.paymentId.status === 'Completed') {
      graph.mergeEdge(paylog.endorserId, paylog.recipientId, { pay: paylog.amount });
    }
  })
}

exports.getMaxLimit = async (req, res, next) => {
  const { recipient } = req.params;
  const sender = req.user._id;
  const maxAmount =  await this._getMaxFlow(sender, recipient)
  res.send({ maxAmount });
}

exports._getMaxFlow = async (sender, recipient, amount = null) => {
  await buildGraph();
  let paths = allSimplePaths(graph, sender, recipient);
  console.log(paths);
  // TODO sort for balancing routes

  let maxAmount = 0;
  let finished = false;
  for (const path of paths) {
    console.log(path.join('->'))
    let min;
    for(let i=0; i<path.length-1; i++) {
      let limit =
        (graph.hasEdge(path[i], path[i+1]) && graph.getEdgeAttribute(path[i], path[i+1], 'trust') ? parseFloat(graph.getEdgeAttribute(path[i], path[i+1], 'trust')) : 0) - (graph.hasEdge(path[i], path[i+1]) && graph.getEdgeAttribute(path[i], path[i+1], 'pay') ? parseFloat(graph.getEdgeAttribute(path[i], path[i+1], 'pay')) : 0) + (graph.hasEdge(path[i+1], path[i]) && graph.getEdgeAttribute(path[i+1], path[i], 'pay') ? parseFloat(graph.getEdgeAttribute(path[i+1], path[i], 'pay')) : 0) - (graph.hasEdge(path[i], path[i+1]) && graph.getEdgeAttribute(path[i], path[i+1], 'tempPay') ? parseFloat(graph.getEdgeAttribute(path[i], path[i+1], 'tempPay')) : 0)
      if(i === 0) min = limit;
      else min = min < limit ? min : limit
      console.log(limit)
    }

    if(amount && amount - maxAmount < min) {
      min = amount - maxAmount;
      finished = true;
    }

    for(let i=0; i<path.length-1; i++) {
      let tempPayAmount = (graph.hasEdge(path[i], path[i+1]) && graph.getEdgeAttribute(path[i], path[i+1], 'tempPay') ? parseFloat(graph.getEdgeAttribute(path[i], path[i+1], 'tempPay')) : 0) + min;
      if(tempPayAmount > 0) graph.setEdgeAttribute(path[i], path[i+1], 'tempPay', tempPayAmount)
    }
    console.log("min:", min);
    maxAmount += min;
    if(finished) break;
  }
  console.log("maxAmount:", maxAmount)

  const paylogs = graph.edges().filter(edge => graph.hasEdgeAttribute(edge, 'tempPay')).map(edge => ({from: graph.source(edge), to: graph.target(edge), amount: graph.getEdgeAttribute(edge, "tempPay")}))

  return { maxAmount, paylogs };
}
