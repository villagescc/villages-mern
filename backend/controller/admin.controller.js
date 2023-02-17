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

exports.uploadAvatar = async (req, res, next) => {
  const uploadFile = req.file;
  const user = JSON.parse(req.body.user);
  try {
    await Profile.findByIdAndUpdate(user.profile._id, {
      avatar: uploadFile.filename,
    });
    res.send({ success: true });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.editUserData = async (req, res, next) => {
  const { email, username, location, description, user } = req.body;

  try {
    await User.findByIdAndUpdate(user._id, {
      email,
      username,
      location,
    });
    await Profile.findByIdAndUpdate(user.profile._id, {
      description,
    });
    res.send({ success: true });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.userActivate = async (req, res, next) => {
  const { _id, isActive } = req.body;

  try {
    await User.findByIdAndUpdate(_id, {
      isActive: !isActive,
    });
    res.send({ success: true });
  } catch (error) {
    console.log(err);
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  const { _id } = req.body;

  try {
    await User.findByIdAndDelete(_id);
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
};
