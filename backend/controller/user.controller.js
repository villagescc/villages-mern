const User = require("../models/User");
const Profile = require("../models/Profile");
const ProfileSetting = require("../models/ProfileSetting");
const Account = require("../models/Account");
const {
  _getFollowers,
  _getFollowings,
} = require("../controller/endorsement.controller");
const { _getBalanceById } = require("../controller/account.controller");
const Listing = require("../models/Listing");
const Log = require("../models/Log");
const Payment = require("../models/Payment");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

exports.search = async (req, res, next) => {
  let { keyword, page } = req.body;
  if (!page) page = 1;
  let query = {};
  try {
    if (keyword && keyword !== "") {
      query = {
        $or: [
          { firstName: { $regex: keyword, $options: "i" } },
          { lastName: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
          { username: { $regex: keyword, $options: "i" } },
        ],
      };
    }
    const users = await User.find(query).sort({ createdAt: -1 }).select("id");
    let filteredUsers = [...users].slice((page - 1) * 10, page * 10);
    let userData = [];
    for (let i = 0; i < filteredUsers.length; i++) {
      let userInfo = await getUserDetail(filteredUsers[i]["id"]);
      userData.push(userInfo);
    }
    res.send({ total: users.length, users: userData });
  } catch (err) {
    console.log("filter error:", err);
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const user = await getUserDetail(req.params.id);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

const getUserDetail = async (id) => {
  const start = Date.now();
  // let userInfo = {};
  const user = await User.findById(id).exec();
  const profile = await Profile.findOne({ user: id });
  const account = await Account.findOne({ user: id });
  // TODO update fields name in model
  const postings = await Listing.find({ userId: id });
  const logs = await Log.find({ user: id });
  const payments = await Payment.find({
    $or: [
      {
        payer: id,
      },
      {
        recipient: id,
      },
    ],
    status: "Completed",
  })
    .populate({
      path: "recipient",
      model: "user",
      populate: { path: "profile", model: "profile" },
    })
    .populate({
      path: "payer",
      model: "user",
      populate: { path: "profile", model: "profile" },
    })
    .exec();

  const userInfo = {
    ...user._doc,
    account,
    profile,
    postings,
    followers: await _getFollowers(id),
    followings: await _getFollowings(id),
    logs,
    payments,
  };

  const span = Date.now() - start;
  console.log(`fetched ${id} - ${span}`);
  return userInfo;
};

exports.uploadAvatar = async (req, res, next) => {
  const uploadFile = req.file;
  const { filename: image } = req.file;
  try {
    await sharp(req.file.path)
      .resize(200, 200)
      .jpeg({ quality: 90 })
      .toFile(path.resolve(req.file.destination, "resized", image));
    fs.unlinkSync(req.file.path);
  } catch (err) {
    console.log(err);
  }
  try {
    await Profile.findByIdAndUpdate(req.user.profile, {
      avatar: `resized/${uploadFile.filename}`,
    });
    res.send({ success: true });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.saveProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, job, placeId, description } = req.body;
    let user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { firstName, lastName }
    );
    await Profile.findOneAndUpdate(
      { _id: user.profile },
      { job, description, placeId }
    );
    user = await getUserDetail(req.user._id);
    res.send({ success: true, user });
  } catch (err) {
    next(err);
  }
};

exports.saveProfileSetting = async (req, res, next) => {
  try {
    const { email, notificationCheck, updateCheck, language, feedRadius } =
      req.body;

    let user = await User.findOne({ _id: req.user._id });
    let profileSetting = await ProfileSetting.findOne({ user: req.user._id });
    if (profileSetting) {
      profileSetting.receiveNotifications = notificationCheck;
      profileSetting.receiveUpdates = updateCheck;
      profileSetting.feedRadius = feedRadius;
      profileSetting.language = language;
      profileSetting.user = req.user._id;
      await profileSetting.save();
    } else {
      await ProfileSetting.create({
        receiveNotifications: notificationCheck,
        receiveUpdates: updateCheck,
        feedRadius: feedRadius,
        language: language,
        user: req.user._id,
      });
    }
    if (email !== "") {
      user.email = email;
      await user.save();
    }
    res.send({ success: true });
  } catch (err) {
    next(err);
  }
};
