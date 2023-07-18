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

exports.search = async (req, res, next) => {
  const token = req.header("Authorization");
  let { keyword, page, value } = req.body;

  if (!page) page = 1;
  let query = {};
  let arr = []
  try {
    if (keyword && keyword !== "") {
      page = 1
      query = {
        $or: [
          { firstName: { $regex: keyword, $options: "i" } },
          { lastName: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
          { username: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    // To find people without any Filter
    const users = await User.find(query).sort({ createdAt: -1 }).select("username");
    let filteredUsers = [...users].slice((page - 1) * 10, page * 10);
    let userData = [];
    let userInfo = await getUserDetail(filteredUsers.map(x => x.username));
    userData.push(userInfo);
    res.send({ total: users.length, users: userInfo });
  } catch (err) {
    console.log("filter error:", err);
    next(err);
  }
};
const getUserDetail = async (username) => {
  const user = await User.aggregate([
    {
      $match: { "username": { $in: username } }
    },
    {
      $project: { _id: 1, account: 1, profile: 1, username: 1, email: 1, createdAt: 1, isActive: 1, isSuperuser: 1, verified: 1 }
    },
    {
      $lookup: {
        from: "profiles",
        foreignField: "_id",
        localField: "profile",
        as: "profile"
      }
    },
    {
      $addFields: {
        profile: { $arrayElemAt: ["$profile", 0] }
      }
    },
    {
      $lookup: {
        from: "accounts",
        foreignField: "_id",
        localField: "account",
        as: "account"
      }
    },
    {
      $addFields: {
        account: { $arrayElemAt: ["$account", 0] }
      }
    },
    {
      $lookup: {
        from: "endorsements",
        foreignField: "recipientId",
        localField: "_id",
        as: "followers",
        pipeline: [
          {
            $match: { weight: { $ne: Number(0) } }
          },
          {
            $sort: { createdAt: -1 }
          },
          {
            $lookup: {
              from: "profiles",
              foreignField: "user",
              localField: "endorserId",
              as: "profile",
              pipeline: [
                {
                  $project: { name: 1, avatar: 1, user: 1, placeId: 1, website: 1, zipCode: 1 }
                }
              ]
            }
          },
          {
            $addFields: {
              profile: { $arrayElemAt: ["$profile", 0] }
            }
          },
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "profile.user",
              as: "profile.user",
              pipeline: [
                {
                  $project: { username: 1, firstName: 1, lastName: 1, email: 1, profile: 1, job: 1 }
                }
              ]
            }
          },
          {
            $addFields: {
              "profile.user": { $arrayElemAt: ["$profile.user", 0] }
            }
          },
          {
            $project: { recipientId: 1, endorserId: 1, text: 1, weight: 1, profile: 1 }
          }
        ]
      }
    },
    {
      $lookup: {
        from: "endorsements",
        foreignField: "endorserId",
        localField: "_id",
        as: "followings",
        pipeline: [
          {
            $match: { weight: { $ne: Number(0) } }
          },
          {
            $sort: { createdAt: -1 }
          },
          {
            $lookup: {
              from: "profiles",
              foreignField: "user",
              localField: "recipientId",
              as: "profile",
              pipeline: [
                {
                  $project: { name: 1, avatar: 1, user: 1, placeId: 1, website: 1, zipCode: 1 }
                }
              ]
            }
          },
          {
            $addFields: {
              profile: { $arrayElemAt: ["$profile", 0] }
            }
          },
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "profile.user",
              as: "profile.user",
              pipeline: [
                {
                  $project: { username: 1, firstName: 1, lastName: 1, email: 1, profile: 1, job: 1, isActive: 1, isSuperuser: 1 }
                }
              ]
            }
          },
          {
            $addFields: {
              "profile.user": { $arrayElemAt: ["$profile.user", 0] }
            }
          },
          {
            $project: { recipientId: 1, endorserId: 1, text: 1, weight: 1, profile: 1 }
          }
        ]
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ])
  // const span = Date.now() - start;
  // console.log(`fetched ${user._id} - ${span}`);
  return user;
};