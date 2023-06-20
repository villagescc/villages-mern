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
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

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
  const user = JSON.parse(req.body.user);
  try {
    await Profile.findByIdAndUpdate(user.profile._id, {
      avatar: `resized/${uploadFile.filename}`,
    });
    res.send({ success: true });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.editUserData = async (req, res, next) => {
  console.log(req.body);
  const { userData, lng, lat } = req.body;

  try {
    await User.findOneAndUpdate(
      { _id: userData.userId },
      {
        email: userData.email,
        username: userData.username,
        latitude: lat,
        longitude: lng,
      }
    );
    await Profile.findOneAndUpdate(
      { user: userData.userId },
      {
        job: userData.job,
        description: userData.description,
        placeId: userData.placeId,
      }
    );
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
exports.userVerification = async (req, res, next) => {
  const { _id } = req.body;

  try {
    await User.findByIdAndUpdate(_id, {
      verified: true
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
