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
const { headingDistanceTo } = require("geolocation-utils");
const Endorsement = require("../models/Endorsement");
var mongoose = require('mongoose');
const jwt = require("jsonwebtoken");


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
    if (value === "All") {
      const users = await User.find(query).sort({ createdAt: -1 }).select("username");
      let filteredUsers = [...users].slice((page - 1) * 10, page * 10);
      let userData = [];
      let userInfo = await getUserDetail(filteredUsers.map(x => x.username));
      userData.push(userInfo);
      res.send({ total: users.length, users: userInfo });
    }
    else {
      const decoded = token && jwt.verify(token, process.env.jwtSecret);
      const user = decoded?.user
      if (user) {
        const radius = 100000 * 1.609;
        const userLocation = await User.findById(user?._id).select(
          "longitude latitude"
        );
        const centerLocation = {
          lat: userLocation.latitude,
          lon: userLocation.longitude,
        };
        const filterRadiusUsers = [];
        if (userLocation.latitude && userLocation.longitude) {
          const span = Date.now()

          const filterUsers = await User.find({}).select("longitude latitude");
          for (var i = 0; i < filterUsers.length; i++) {
            if (filterUsers[i].latitude && filterUsers[i].longitude) {
              const filterLocation = {
                lat: filterUsers[i].latitude,
                lon: filterUsers[i].longitude,
              };
              const result = await headingDistanceTo(
                centerLocation,
                filterLocation
              );
              if (result.distance < radius) {
                filterRadiusUsers.push(mongoose.Types.ObjectId(filterUsers[i]._id));
              }
            }
          }
          const span1 = Date.now() - span
          console.log(`fetched- ${span1}`);
        }

        const receipent = await Endorsement.aggregate([
          {
            $match: { recipientId: { $in: [...filterRadiusUsers.map(x => x), user?._id] } }
          },
          {
            $group: { _id: null, endorsers: { $push: { $toString: '$endorserId' } } }
          }
        ])
        const endorser = await Endorsement.aggregate([
          {
            $match: { endorserId: { $in: filterRadiusUsers.map(x => x) } }
          },
          {
            $group: { _id: null, receipents: { $push: { $toString: '$recipientId' } } }
          }
        ])
        if (filterRadiusUsers.length) {
          arr = [...new Set([...filterRadiusUsers.map(x => x?.toString())])]
        }
        if (receipent.length) {
          arr = [...new Set([...arr, ...receipent[0]?.endorsers])]
        }
        if (endorser.length) {
          arr = [...new Set([...arr, ...endorser[0]?.receipents])]
        }
        if (filterRadiusUsers.length && receipent.length && endorser.length) {
          arr = [...new Set([...filterRadiusUsers.map(x => x?.toString()), ...receipent[0]?.endorsers, ...endorser[0]?.receipents])]
        }
      }
      // const users = await User.find(...(arr.length !== 0 ? [{ "_id": { $in: arr }, ...query }] : [query])).sort({ createdAt: -1 }).select("username");
      const users = await User.find({ "_id": { $in: arr }, ...query }).sort({ createdAt: -1 }).select("username");
      console.log(users.length, "sadas")
      let filteredUsers = [...users].slice((page - 1) * 10, page * 10);
      let userData = [];
      let userInfo = await getUserDetail(filteredUsers.map(x => x.username));
      userData.push(userInfo);
      res.send({ total: users.length, users: userInfo });
    }
  } catch (err) {
    console.log("filter error:", err);
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    user?.length ? res.send(...user) : res.send({})
  } catch (err) {
    next(err);
  }
};
exports.getByUserName = async (req, res, next) => {
  try {
    const user = await getUserDetailByUserName(req.params.username);
    user?.length ? res.send(...user) : res.send({})
  } catch (err) {
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

const getUserDetailByUserName = async (username) => {
  const user = await User.aggregate([
    {
      $match: { username }
    },
    {
      $project: { password: 0, token: 0, lastLogin: 0 }
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
              from: "users",
              foreignField: "_id",
              localField: "profile.user",
              as: "profile.user",
            }
          },
          {
            $addFields: {
              "profile.user": { $arrayElemAt: ["$profile.user", 0] }
            }
          }
        ]
      }
    },
    {
      $lookup: {
        from: 'listings',
        foreignField: "userId",
        localField: "_id",
        as: "postings",
        pipeline: [
          {
            $lookup: {
              from: 'users',
              foreignField: "_id",
              localField: "userId",
              as: "user",
            }
          },
          {
            $addFields: {
              "user": { $arrayElemAt: ["$user", 0] }
            }
          }
        ]
      }
    }
  ])
  return user;
};

const getUserById = async (id) => {
  const user = User.aggregate([
    {
      $match: { $expr: { $eq: ['$_id', { $toObjectId: id }] } }
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
      $addFields: { profile: { $arrayElemAt: ["$profile", 0] } }
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
      $addFields: { account: { $arrayElemAt: ["$account", 0] } }
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
          }
        ]
      }
    },
    {
      $project: { username: 1, firstName: 1, lastName: 1, email: 1, latitude: 1, longitude: 1, isSuperuser: 1, profile: 1, account: 1, followers: 1, followings: 1 }
    }
  ])

  return user
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
    const {
      firstName,
      lastName,
      job,
      placeId,
      description,
      website,
      zipCode,
      phoneNumber,
      lat,
      lng,
    } = req.body;
    let user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { firstName, lastName, latitude: Number(lat), longitude: Number(lng) }
    );
    await Profile.findOneAndUpdate(
      { _id: user.profile },
      { job, description, placeId, website, zipCode, phoneNumber }
    );
    user = await getUserById(req.user._id);
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

exports.deactive = async (req, res, next) => {
  try {
    user = await User.findById(req.user._id);
    if (user) {
      user.isActive = false;
      await user.save();
    }
    res.send({ success: true });
  } catch (err) {
    next(err);
  }
};
