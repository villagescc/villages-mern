const Graph = require("graphology");
const { allSimplePaths } = require("graphology-simple-path");
const { _create: createNotification } = require("./notification.controller");

const User = require("../models/User");
const Account = require("../models/Account");
const Payment = require("../models/Payment");
const Endorsement = require("../models/Endorsement");
const Paylog = require("../models/Paylog");
const isEmpty = require("../validation/is-empty");

const axios = require("axios");
const { default: mongoose } = require("mongoose");
const sendEmail = require("../utils/email");

// const _getUser = async (id) => {
//   const user = await User.findById(id).exec();
//   if (user) {
//     // user.account = await Account.findOne({ user: user._id }).exec();
//     user.profile = await Profile.findOne({ user: user._id })
//       .select("avatar")
//       .exec();
//   }

//   return user;
// };

// const buildGraph = async (nodes = null) => {
//   const graph = await new Graph();
//   const users = await User.find();
//   for (let user of users) {
//     const userData = await _getUser(user.id);
//     if (nodes !== null && !nodes.includes(user.id)) continue;
//     graph.addNode(user.id, {
//       ...userData._doc,
//     });
//   }

//   // layout manually
//   if (nodes === null) {
//     for (let i = 0; i < graph.nodes().length; i++) {
//       const node = graph.nodes()[i];
//       const angle = (i * 2 * Math.PI) / graph.order;
//       graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
//       graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
//     }
//   }

//   let endorsements;
//   if (nodes === null) endorsements = await Endorsement.find();
//   else
//     endorsements = await Endorsement.find({
//       $and: [{ endorserId: { $in: nodes } }, { recipientId: { $in: nodes } }],
//     });

//   for (let endorsement of endorsements) {
//     graph.mergeEdge(endorsement.recipientId, endorsement.endorserId, {
//       limit: endorsement.weight,
//     });
//   }
//   const paylogs = await Paylog.find().populate("paymentId").exec();
//   const filteredPaylogs = paylogs.filter((paylog) => {
//     if (nodes === null) return true;
//     else
//       return (
//         nodes.includes(paylog.recipient) && nodes.includes(paylog.endorserId)
//       );
//   });

//   for (let paylog of filteredPaylogs) {
//     if (paylog.paymentId && paylog.paymentId.status === "Completed") {
//       // increase limit for amount which you got paid
//       if (graph.hasEdge(paylog.recipient, paylog.payer))
//         graph.updateEdgeAttribute(
//           paylog.recipient,
//           paylog.payer,
//           "limit",
//           (limit) => (limit || 0) + paylog.amount
//         );
//       else
//         graph.mergeEdge(paylog.recipient, paylog.payer, {
//           limit: paylog.amount,
//         });

//       // decrease limit for amount which you paid
//       if (graph.hasEdge(paylog.payer, paylog.recipient))
//         graph.updateEdgeAttribute(
//           paylog.payer,
//           paylog.recipient,
//           "limit",
//           (limit) => (limit || 0) - paylog.amount
//         );
//       else
//         graph.mergeEdge(paylog.payer, paylog.recipient, {
//           limit: -paylog.amount,
//         });
//     }
//   }
//   return graph;
// };

exports.buildGraph = async (nodes = null) => {
  const graph = await new Graph();
  // const users = await User.find();
  // for (let user of users) {
  //   if (nodes !== null && !nodes.includes(user.id)) continue;
  //   graph.addNode(user.id, {
  //     ...user._doc,
  //   });
  // }
  const users = await User.aggregate([{ $lookup: { from: 'profiles', localField: 'profile', foreignField: "_id", as: "profile" } }, {
    $addFields: {
      profile: { $arrayElemAt: ["$profile", 0] }
    }
  },])
  for (let user of users) {
    if (nodes !== null && !nodes.includes(user._id.toString())) continue;
    graph.addNode(user._id, {
      ...user,
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
    const graph = await this.buildGraph();
    res.send(graph);
  } catch (err) {
    next(err);
  }
};

exports.getPath = async (req, res, next) => {
  // console.log(req.body);
  try {
    const { senderId, recipientId } = req.body;
    const result = await this._getMaxFlow(senderId, recipientId);
    let nodes = [];
    if (result.success) {
      for (path of result.paths) {
        nodes = [...nodes, ...path];
      }
      nodes = await nodes.filter((item, pos) => nodes.indexOf(item) === pos);

      const graph = await this.buildGraph(nodes);

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

        const notifyText = `${req.user.username} paid you the amount of ${amount}(V.H.).`;
        const notification = await createNotification(
          "PAYMENT",
          req.user._id,
          recipient,
          amount,
          notifyText
        );
        global.io.emit("newNotification", notification);
        const receiveUser = await User.findById(recipient);

        sendEmail(req.user.email, receiveUser?.email, "Notification from Villages.io", `<h1>You have been paid by ${req.user.firstName} ${req.user.lastName}(${req.user.email})</h1>
        <h2>Hello ${receiveUser?.firstName} ${receiveUser?.lastName}</h2>
        <p>${notifyText}</p>
        <a href=https://villages.io/pay> Click here</a>
        <br>`).then(function (response) {
          // console.log(response);
        })
          .catch(function (error) {
            console.log(error);
          });

        // axios
        //   .post(
        //     "https://us-central1-villages-io-cbb64.cloudfunctions.net/sendMail",
        //     {
        //       subject: "Notification from Villages.io",
        //       dest: receiveUser?.email,
        //       data: `<h1>You have been paid by ${req.user.firstName} ${req.user.lastName}(${req.user.email})</h1>
        //       <h2>Hello ${receiveUser?.firstName} ${receiveUser?.lastName}</h2>
        //       <p>${notifyText}</p>
        //       <a href=https://villages.io/pay> Click here</a>
        //       <br>`,
        //     }
        //   )
        //   .then(function (response) {
        //     // console.log(response);
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   });

        payment.status = "Completed";
        await payment.save();

        // Notify

        res.send({ success: true, paylogs: result.paylogs });
      } catch (error) {
        await Paylog.deleteMany({ paymentId: payment._id });
        payment.status = "Failed";
        await payment.save();
        // console.log("add paylog error:", error);
        next(error);
      }
    } else {
      payment.status = "Failed";
      await payment.save();
      res.status(400).send(result.errors);
    }
  } catch (err) {
    if (payment) {
      payment.status = "Failed";
      await payment.save();
    }
    console.log("pay error:", err);
    next(err);
  }
};

exports._getMaxFlow = async (sender, recipient, amount = null) => {
  const graph = await this.buildGraph();
  if (!graph.hasNode(recipient)) {
    console.log("error");
    return {
      success: false,
      errors: {
        recipient: "This recipient has not any account",
      },
    };
  }

  if (sender === recipient) {
    console.log("selferror");
    return {
      success: false,
      errors: {
        recipient: "You cannot send to yourself.",
      },
    };
  }


  let paths = allSimplePaths(graph, sender, recipient, { maxDepth: 2 });
  // console.log(paths);

  // console.log(SimplePathsLengthN(graph, sender, recipient));
  // TODO sort for balancing routes

  let maxLimit = 0;
  let finished = false;
  for (const path of paths) {
    // console.log(path.join("->"));
    let min;
    for (let i = 0; i < path.length - 1; i++) {
      let limit =
        (graph.hasEdge(path[i], path[i + 1]) &&
          graph.getEdgeAttribute(path[i], path[i + 1], "limit")
          ? graph.getEdgeAttribute(path[i], path[i + 1], "limit") >= 0 ? parseFloat(graph.getEdgeAttribute(path[i], path[i + 1], "limit")) : 0
          : 0) -
        (graph.hasEdge(path[i], path[i + 1]) &&
          graph.getEdgeAttribute(path[i], path[i + 1], "tempPay")
          ? parseFloat(graph.getEdgeAttribute(path[i], path[i + 1], "tempPay"))
          : 0);
      if (i === 0) min = limit;
      else min = min !== 0 ? min < limit ? min : limit !== 0 ? limit : min : limit;
      // console.log(limit);
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
    // console.log("min:", min);
    maxLimit += min;
    if (finished) break;
  }
  // console.log("maxLimit:", maxLimit);

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
  const { page, keyword, status, address, paymentType, period } = req.body;
  const pipeline = [{ $sort: { createdAt: -1 } }]
  try {
    // const total = await Payment.find({
    //   $or: [{ payer: req.user._id }, { recipient: req.user._id }],
    // })
    //   .sort({ createdAt: -1 })
    //   .countDocuments();
    // console.log(total);
    const query = Payment.find().sort({ createdAt: -1 });
    if (period?.length === 2) {
      const subquery = [];
      if (period[0]) {
        subquery.push({
          createdAt: {
            $gte: new Date(period[0]),
          },
        });
      }
      if (period[1]) {
        subquery.push({
          createdAt: {
            $lte: new Date(period[1]),
          },
        });
      }
      if (subquery.length > 0) {
        // query.and(subquery);
        pipeline.push({ $match: { $and: subquery } })
      }
    }
    if (paymentType === "All") {
      // query.or([{ payer: req.user._id }, { recipient: req.user._id }]);
      pipeline.push({ $match: { $or: [{ payer: mongoose.Types.ObjectId(req.user._id) }, { recipient: mongoose.Types.ObjectId(req.user._id) }] } })
    } else {
      if (paymentType === "Withdraw") {
        // query.where("payer", req.user._id);
        pipeline.push({ $match: { payer: mongoose.Types.ObjectId(req.user._id) } })
        if (!isEmpty(address)) {
          pipeline.push({ $match: { recipient: address } })
          // query.where("recipient", address);
        }
      }
      if (paymentType === "Deposit") {
        pipeline.push({ $match: { recipient: mongoose.Types.ObjectId(req.user._id) } })
        // query.where("recipient", req.user._id);
        if (!isEmpty(address)) {
          pipeline.push({ $match: { payer: address } })
          // query.where("payer", address);
        }
      }
    }
    // if (keyword !== "") {
    //   query.or([
    //     { title: { $regex: keyword, $options: "i" } },
    //     { description: { $regex: keyword, $options: "i" } },
    //   ]);
    // }
    if (status !== "All") {
      pipeline.push({ $match: { status: status } })
      // query.where({ status: status });
    }
    // pipeline.push()
    // console.log(query);
    pipeline.push(
      {
        $lookup: {
          from: 'users',
          localField: 'recipient',
          foreignField: "_id",
          as: 'recipient',
          pipeline: [
            {
              $lookup: {
                from: 'profiles',
                localField: 'profile',
                foreignField: "_id",
                as: 'profile'
              }
            },
            {
              $addFields: {
                profile: { $arrayElemAt: ['$profile', 0] },
                fullName: { $concat: ['$firstName', " ", '$lastName'] }
              }
            }
          ]
        }
      },
      {
        $addFields: {
          recipient: { $arrayElemAt: ['$recipient', 0] }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'payer',
          foreignField: "_id",
          as: 'payer',
          pipeline: [
            {
              $lookup: {
                from: 'profiles',
                localField: 'profile',
                foreignField: "_id",
                as: 'profile'
              }
            },
            {
              $addFields: {
                profile: { $arrayElemAt: ['$profile', 0] },
                fullName: { $concat: ['$firstName', " ", '$lastName'] }
              }
            }
          ]
        }
      },
      {
        $addFields: {
          payer: { $arrayElemAt: ['$payer', 0] }
        }
      }
    )
    if (keyword !== "") {
      pipeline.push({
        $match: {
          $or: [
            { memo: { $regex: keyword, $options: "i" } },
            { 'payer.email': { $regex: keyword, $options: "i" } },
            { 'recipient.email': { $regex: keyword, $options: "i" } },
            { 'payer.fullName': { $regex: keyword, $options: "i" } },
            { 'recipient.fullName': { $regex: keyword, $options: "i" } },
            { 'payer.username': { $regex: keyword, $options: "i" } },
            { 'recipient.username': { $regex: keyword, $options: "i" } },
            { 'payer.profile.phoneNumber': { $regex: keyword, $options: "i" } },
            { 'payer.profile.description': { $regex: keyword, $options: "i" } },
            { 'recipient.profile.phoneNumber': { $regex: keyword, $options: "i" } },
            { 'recipient.profile.description': { $regex: keyword, $options: "i" } },
          ]
        }
      })
      // query.and([{ memo: { $regex: keyword, $options: "i" } }]);
      // query.or([{ 'status': { $regex: keyword, $options: "i" } }])
    }
    // query.skip(page * 10 - 10).limit(10);
    const total = (await Payment.aggregate(pipeline)).length
    pipeline.push({ $skip: page * 10 - 10 }, { $limit: 10 })
    const transactions = await Payment.aggregate(pipeline);

    // const transactions = await query
    //   .populate({
    //     path: "recipient",
    //     model: "user",
    //     populate: {
    //       path: "profile",
    //       model: "profile",
    //     },
    //   })
    //   .populate({
    //     path: "payer",
    //     model: "user",
    //     populate: {
    //       path: "profile",
    //       model: "profile",
    //     },
    //   })
    //     .exec();
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
    const paylogs = await Paylog.find({ paymentId: id })
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
    res.send({
      success: true,
      transaction: { ...transaction.toObject(), paylogs },
    });
  } catch (error) {
    next(error);
  }
};
