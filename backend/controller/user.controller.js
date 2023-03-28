const User = require("../models/User");
const Profile = require("../models/Profile");
const Account = require("../models/Account");
const {
  _getFollowers,
  _getFollowings,
} = require("../controller/endorsement.controller");
const { _getBalanceById } = require("../controller/account.controller");
const Listing = require("../models/Listing");
const Log = require("../models/Log");
const Payment = require("../models/Payment");

exports.search = async (req, res, next) => {
  let { keyword, page } = req.body;
  if (!page) page = 1;
  console.log(page);
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
    const users = await User.find(query).populate("profile").exec();
    let filteredUsers = [...users].reverse().slice((page - 1) * 10, page * 10);
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

  return userInfo;
};

exports.uploadAvatar = async (req, res, next) => {
  const uploadFile = req.file;
  try {
    await Profile.findByIdAndUpdate(req.user.profile, {
      avatar: uploadFile.filename,
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
