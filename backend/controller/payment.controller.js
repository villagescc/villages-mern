const Graph = require("graphology");
const { allSimplePaths } = require("graphology-simple-path");
const { _create: createNotification } = require("./notification.controller");

const User = require("../models/User");
const Account = require("../models/Account");
const Payment = require("../models/Payment");
const Endorsement = require("../models/Endorsement");
const Paylog = require("../models/Paylog");
const isEmpty = require("../validation/is-empty");

const buildGraph = async (nodes = null) => {
  const graph = await new Graph();
  const users = await User.find();
  for (let user of users) {
    if (nodes !== null && !nodes.includes(user.id)) continue;
    graph.addNode(user.id, {
      ...user._doc,
    });
  }

  // layout manually
  if (nodes === null) {
    graph.nodes().forEach((node, i) => {
      const angle = (i * 2 * Math.PI) / graph.order;
      graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
      graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
    });
  }

  let endorsements;
  if (nodes === null) endorsements = await Endorsement.find();
  else
    endorsements = await Endorsement.find({
      $and: [{ endorserId: { $in: nodes } }, { recipientId: { $in: nodes } }],
    });
  endorsements.forEach((endorsement) => {
    graph.mergeEdge(endorsement.recipientId, endorsement.endorserId, {
      limit: endorsement.weight,
    });
  });
  const paylogs = await Paylog.find().populate("paymentId").exec();
  paylogs
    .filter((paylog) => {
      if (nodes === null) return true;
      else
        return (
          nodes.includes(paylog.recipient) && nodes.includes(paylog.endorserId)
        );
    })
    .forEach((paylog) => {
      if (paylog.paymentId && paylog.paymentId.status === "Completed") {
        // increase limit for amount which you got paid
        if (graph.hasEdge(paylog.recipient, paylog.payer))
          graph.updateEdgeAttribute(
            paylog.recipient,
            paylog.payer,
            "limit",
            (limit) => (limit || 0) + paylog.amount
          );
        else
          graph.mergeEdge(paylog.recipient, paylog.payer, {
            limit: paylog.amount,
          });

        // decrease limit for amount which you paid
        if (graph.hasEdge(paylog.payer, paylog.recipient))
          graph.updateEdgeAttribute(
            paylog.payer,
            paylog.recipient,
            "limit",
            (limit) => (limit || 0) - paylog.amount
          );
        else
          graph.mergeEdge(paylog.payer, paylog.recipient, {
            limit: -paylog.amount,
          });
      }
    });
  return graph;
};

exports.getGraph = async (req, res, next) => {
  try {
    const graph = await buildGraph();
    res.send(graph);
  } catch (err) {
    next(err);
  }
};

exports.getPath = async (req, res, next) => {
  try {
    const { senderId, recipientId } = req.body;

    const result = await this._getMaxFlow(senderId, recipientId);
    let nodes = [];
    if (result.success) {
      for (path of result.paths) {
        nodes = [...nodes, ...path];
      }
      nodes = await nodes.filter((item, pos) => nodes.indexOf(item) === pos);
      const graph = await buildGraph();
      res.send(graph);
    } else {
      res.status(400).send(result.errors);
    }
  } catch (err) {
    console.log("getPath error:", err);
    next(err);
  }
};

exports.getMaxLimit = async (req, res, next) => {
  const { recipient } = req.params;
  const sender = req.user._id;
  try {
    const result = await this._getMaxFlow(sender, recipient);
    if (result.success) {
      res.send({ maxLimit: result.maxLimit, paylogs: result.paylogs });
    } else {
      res.status(400).send(result.errors);
    }
  } catch (error) {
    console.log("get max limit error", error);
    next(error);
  }
};

exports.pay = async (req, res, next) => {
  const { recipient, amount, memo } = req.body;
  const payer = req.user._id;
  let payment;

  try {
    payment = await Payment.create({ amount, memo, payer, recipient });

    const result = await this._getMaxFlow(payer, recipient, amount);
    if (result.success) {
      try {
        await Paylog.insertMany(
          result.paylogs.map((paylog) => ({
            ...paylog,
            paymentId: payment._id,
          })),
          { ordered: false }
        );

        await Account.findOneAndUpdate(
          { user: payer },
          { $inc: { balance: -amount } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        await Account.findOneAndUpdate(
          { user: recipient },
          { $inc: { balance: amount } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        payment.status = "Completed";
        payment.save();

        // Notify
        const notifyText = `${req.user.username} paid you the amount of ${amount}(V.H.).`;
        const notification = await createNotification(
          "PAYMENT",
          req.user._id,
          recipient,
          amount,
          notifyText
        );
        global.io.emit("newNotification", notification);

        res.send({ success: true, paylogs: result.paylogs });
      } catch (error) {
        await Paylog.deleteMany({ paymentId: payment._id });
        payment.status = "Failed";
        payment.save();
        console.log("add paylog error:", error);
        next(error);
      }
    } else {
      payment.status = "Failed";
      payment.save();
      res.status(400).send(result.errors);
    }
  } catch (err) {
    if (payment) {
      payment.status = "Failed";
      payment.save();
    }
    console.log("pay error:", err);
    next(err);
  }
};

exports._getMaxFlow = async (sender, recipient, amount = null) => {
  const graph = await buildGraph();
  if (!graph.hasNode(recipient)) {
    return {
      success: false,
      errors: {
        recipient: "This recipient has not any account",
      },
    };
  }

  if (sender === recipient) {
    return {
      success: false,
      errors: {
        recipient: "You cannot send to yourself.",
      },
    };
  }

  let paths = allSimplePaths(graph, sender, recipient);
  console.log(paths);
  // TODO sort for balancing routes

  let maxLimit = 0;
  let finished = false;
  for (const path of paths) {
    console.log(path.join("->"));
    let min;
    for (let i = 0; i < path.length - 1; i++) {
      let limit =
        (graph.hasEdge(path[i], path[i + 1]) &&
        graph.getEdgeAttribute(path[i], path[i + 1], "limit")
          ? parseFloat(graph.getEdgeAttribute(path[i], path[i + 1], "limit"))
          : 0) -
        (graph.hasEdge(path[i], path[i + 1]) &&
        graph.getEdgeAttribute(path[i], path[i + 1], "tempPay")
          ? parseFloat(graph.getEdgeAttribute(path[i], path[i + 1], "tempPay"))
          : 0);
      if (i === 0) min = limit;
      else min = min < limit ? min : limit;
      console.log(limit);
    }

    if (amount && amount - maxLimit < min) {
      min = amount - maxLimit;
      finished = true;
    }

    for (let i = 0; i < path.length - 1; i++) {
      let tempPayAmount =
        (graph.hasEdge(path[i], path[i + 1]) &&
        graph.getEdgeAttribute(path[i], path[i + 1], "tempPay")
          ? parseFloat(graph.getEdgeAttribute(path[i], path[i + 1], "tempPay"))
          : 0) + min;
      if (tempPayAmount > 0)
        graph.setEdgeAttribute(path[i], path[i + 1], "tempPay", tempPayAmount);
    }
    console.log("min:", min);
    maxLimit += min;
    if (finished) break;
  }
  console.log("maxLimit:", maxLimit);

  if (amount > maxLimit)
    return {
      success: false,
      errors: {
        amount: `You can send up to ${maxLimit}VH.`,
      },
    };

  const paylogs = graph
    .edges()
    .filter((edge) => graph.hasEdgeAttribute(edge, "tempPay"))
    .map((edge) => ({
      payer: graph.source(edge),
      recipient: graph.target(edge),
      amount: graph.getEdgeAttribute(edge, "tempPay"),
    }));

  return { success: true, maxLimit, paylogs, paths };
};

exports.searchTransactions = async (req, res, next) => {
  try {
    const total = await Payment.find({
      $or: [{ payer: req.user._id }, { recipient: req.user._id }],
    }).countDocuments();
    const query = Payment.find();
    if (req.body && req.body.period.length === 2) {
      query.and([
        {
          createdAt: {
            $gte: new Date(req.body.period[0]),
            $lt: new Date(req.body.period[1]),
          },
        },
      ]);
    }
    if (req.body && req.body.paymentType === "All") {
      query.or([{ payer: req.user._id }, { recipient: req.user._id }]);
    } else {
      if (req.body && req.body.paymentType === "Withdraw") {
        query.where("payer", req.user._id);
        if (req.body.address && !isEmpty(req.body.address)) {
          query.where("recipient", req.body.address);
        }
      }
      if (req.body && req.body.paymentType === "Deposit") {
        query.where("recipient", req.user._id);
        if (req.body.address && !isEmpty(req.body.address)) {
          query.where("payer", req.body.address);
        }
      }
    }
    if (req.body && !isEmpty(req.body.keyword)) {
      query.and([{ memo: { $regex: req.body.keyword, $options: "i" } }]);
    }
    if (req.body && req.body.status !== "All") {
      query.where("status", req.body.status);
    }
    query.skip(req.body.page * 10 - 10).limit(10);
    const transactions = await query
      .populate({
        path: "recipient",
        model: "user",
        populate: {
          path: "profile",
          model: "profile",
        },
      })
      .populate({
        path: "payer",
        model: "user",
        populate: {
          path: "profile",
          model: "profile",
        },
      })
      .exec();
    res.send({ total, transactions });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transaction = await Payment.findById(id)
      .populate({
        path: "recipient",
        model: "user",
        populate: {
          path: "profile",
          model: "profile",
        },
      })
      .populate({
        path: "payer",
        model: "user",
        populate: {
          path: "profile",
          model: "profile",
        },
      })
      .exec();
    res.send({ success: true, transaction });
  } catch (error) {
    next(error);
  }
};
