const Endorsement = require("../models/Endorsement");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { _create: createNotification } = require("./notification.controller");

exports.save = async (req, res, next) => {
  let errors = {};
  const { recipient, weight, text, referred } = req.body;
  const recipientUser = await User.findById(recipient);
  if (!recipientUser) {
    errors.recipient = "Recipient does not exist.";
    return res.status(404).send(errors);
  }
  if (req.user._id === recipient) {
    errors.recipient = "You can't send trust to yourself.";
    return res.status(400).send(errors);
  }

  try {
    let endorsement = await Endorsement.findOne({
      recipientId: recipientUser._id,
      endorserId: req.user._id,
    });
    let notifyText;
    if (!endorsement) {
      endorsement = await Endorsement.create({
        recipientId: recipientUser._id,
        endorserId: req.user._id,
        weight,
        text,
        referred,
      });
      notifyText = `${req.user.username} sent you ${weight}(V.H.) trust limit.`;
    } else {
      endorsement.weight = weight;
      endorsement.text = text;
      endorsement.referred = referred;
      await endorsement.save();
      notifyText = `${req.user.username} updated trust limit as ${weight}(V.H.).`;
    }
    const notification = await createNotification(
      "TRUST",
      req.user._id,
      recipient,
      weight,
      notifyText
    );
    global.io.emit("newNotification", notification);
    res.send(endorsement);

    axios.post('https://us-central1-villages-io-cbb64.cloudfunctions.net/broadcast', { 
      receiverFcm: recipientUser.deviceToken, 
      message: notifyText 
    });

  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  const { keyword, page } = req.body;
  try {
    let query = { $and: [] };
    query.$and.push({
      $or: [{ endorserId: req.user._id }, { recipientId: req.user._id }],
    });
    if (keyword && keyword !== "") {
      const users = await User.find({
        $or: [
          { firstName: { $regex: keyword, $options: "i" } },
          { lastName: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
          { username: { $regex: keyword, $options: "i" } },
        ],
      });
      query.$and.push({
        $or: [
          { recipientId: { $in: users.map((user) => user._id) } },
          { endorserId: { $in: users.map((user) => user._id) } },
          { text: { $regex: keyword, $options: "i" } },
        ],
      });
    }
    const endorsements = await Endorsement.find(query)
      .populate({
        path: "recipientId",
        model: "user",
        populate: { path: "profile", model: "profile" },
      })
      .populate({
        path: "endorserId",
        model: "user",
        populate: { path: "profile", model: "profile" },
      })
      .exec();

    let endorsements_group = {};
    for (let i = 0; i < endorsements.length; i++) {
      if (
        endorsements[i].endorserId &&
        endorsements[i].endorserId._id &&
        endorsements[i].recipientId &&
        endorsements[i].recipientId._id
      ) {
        if (endorsements[i].endorserId._id.toString() === req.user._id) {
          if (
            Object.keys(endorsements_group).includes(
              endorsements[i].recipientId?._id.toString()
            )
          ) {
            endorsements_group[endorsements[i].recipientId._id] = {
              ...endorsements_group[endorsements[i].recipientId._id],
              send_weight: endorsements[i].weight,
              send_text: endorsements[i].text,
            };
          } else {
            endorsements_group[endorsements[i].recipientId._id] = {
              send_weight: endorsements[i].weight,
              send_text: endorsements[i].text,
              user: endorsements[i].recipientId,
            };
          }
        } else if (
          endorsements[i].recipientId._id.toString() === req.user._id
        ) {
          if (
            Object.keys(endorsements_group).includes(
              endorsements[i].endorserId._id.toString()
            )
          ) {
            endorsements_group[endorsements[i].endorserId._id] = {
              ...endorsements_group[endorsements[i].endorserId._id],
              receive_weight: endorsements[i].weight,
              receive_text: endorsements[i].text,
            };
          } else {
            endorsements_group[endorsements[i].endorserId._id] = {
              receive_weight: endorsements[i].weight,
              receive_text: endorsements[i].text,
              user: endorsements[i].endorserId,
            };
          }
        }
      }
    }

    res.send({
      total: Object.keys(endorsements_group).length,
      endorsements: [...Object.values(endorsements_group)].slice(
        (page - 1) * 12,
        page * 12
      ),
    });
  } catch (err) {
    console.log("filter error:", err);
    next(err);
  }
};

exports.getFollowers = async (req, res, next) => {
  try {
    const followers = await _getFollowers(req.params.id);
    res.send(followers);
  } catch (err) {
    next(err);
  }
};

exports.getFollowings = async (req, res, next) => {
  try {
    const followers = await _getFollowings(req.params.id);
    res.send(followers);
  } catch (err) {
    next(err);
  }
};

exports._getFollowers = async (id) => {
  const endorsers = await Endorsement.find({ recipientId: id }).exec();
  const followers = await Profile.find({
    user: { $in: endorsers.map((endorser) => endorser.endorserId) },
  })
    .populate("user")
    .exec();
  return followers.map((follower) => ({
    ...follower.user._doc,
    profile: follower,
    endorsement: endorsers.find(
      (endorser) => endorser.endorserId == follower.user._id.toString()
    ),
  }));
};

exports._getFollowings = async (id) => {
  const endorsers = await Endorsement.find({ endorserId: id }).exec();
  const followings = await Profile.find({
    user: { $in: endorsers.map((endorser) => endorser.recipientId) },
  })
    .populate("user")
    .exec();
  return followings.map((following) => ({
    ...following.user._doc,
    profile: following,
    endorsement: endorsers.find(
      (endorser) => endorser.recipientId == following.user._id.toString()
    ),
  }));
};
