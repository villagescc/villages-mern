const express = require('express');
const User = require('../models/User');
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Listing = require("../models/Listing");
const Tag = require("../models/Tag");
const isEmpty = require("../validation/is-empty");
const { headingDistanceTo } = require("geolocation-utils");
const { default: mongoose } = require('mongoose');
const jwt = require("jsonwebtoken");

const router = express.Router();

exports.getUsers = async (req, res, next) => {
  User.find({})
    .populate('profile')
    .then(users => {
      res.send(users);
    })
    .catch(err => next(err))
};

exports.mapPosts = async (req, res, next) => {
  const { filterData } = req.body;
  try {
    const pipeline = [{ $sort: { updatedAt: -1 } }]
    // const total = await Listing.countDocuments();
    const query = Listing.find().sort({ updatedAt: -1 });
    if (!isEmpty(filterData.filterCategory)) {
      const cate = await Category.findOne({ title: filterData.filterCategory });
      const categoryId = cate._id;
      const subCategories = await Subcategory.find({ categoryId }).lean();
      // query
      //   .where("subcategoryId")
      //   .in(subCategories.map((subCategory) => subCategory._id));
      pipeline.push({ $match: { subcategoryId: { $in: subCategories.map((subCategory) => mongoose.Types.ObjectId(subCategory._id)) } } })
    }
    if (!isEmpty(filterData.filterType)) {
      // query.where("listing_type", filterData.filterType);
      pipeline.push({ $match: { listing_type: filterData.filterType } })
    }
    if (filterData.filterRadius != "") {
      const radius = filterData.filterRadius * 1.609;

      const userLocation = await User.findById(req.user._id).select(
        "longitude latitude"
      );

      const centerLocation = {
        lat: userLocation.latitude,
        lon: userLocation.longitude,
      };
      const filterUsers = await User.find().select("longitude latitude");
      const filterRadiusUsers = [];
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
          // console.log(Number(result.distance));
          if (result.distance < radius) {
            filterRadiusUsers.push(filterUsers[i]._id);
          }
        }
      }
      // console.log(filterRadiusUsers);
      // query.where("userId").in(filterRadiusUsers);
      pipeline.push({ $match: { userId: { $in: filterRadiusUsers } } })
    }
    // query.populate({
    //   path: "userId",
    //   model: "user",
    //   select: ['profile', 'latitude', 'longitude', 'username', 'firstName', 'lastName'],
    //   populate: {
    //     path: "profile",
    //     model: "profile",
    //     select: ['avatar', 'header_image', 'name', 'user', 'placeId'],
    //   },
    // })
    pipeline.push({
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "userId",
        as: "userId",
        pipeline: [
          {
            $project: {
              profile: 1,
              latitude: 1,
              longitude: 1,
              username: 1,
              firstName: 1,
              lastName: 1
            }
          },
          {
            $lookup: {
              from: "profiles",
              foreignField: "_id",
              localField: "profile",
              as: "profile",
              pipeline: [
                {
                  $project: {
                    avatar: 1,
                    header_image: 1,
                    name: 1,
                    user: 1,
                    placeId: 1
                  }
                }
              ]
            }
          },
          {
            $addFields: {
              profile: { $arrayElemAt: ['$profile', 0] }
            }
          },
        ]
      }
    },
      {
        $addFields: {
          userId: { $arrayElemAt: ['$userId', 0] }
        }
      }
    )
    if (!isEmpty(filterData.keyword)) {
      // query.or([
      //   {
      //     "$expr": {
      //       "$regexMatch": {
      //         "input": "$userId.firstName",
      //         "regex": filterData.keyword,  //Your text search here
      //         "options": "i"
      //       }
      //     }
      //   },
      //   { "userId.username": { $regex: filterData.keyword, $options: "i" } },
      //   { title: { $regex: filterData.keyword, $options: "i" } },
      //   { description: { $regex: filterData.keyword, $options: "i" } },
      // ]);
      pipeline.push({
        $match: {
          $or: [
            {
              "$expr": {
                "$regexMatch": {
                  "input": "$userId.firstName",
                  "regex": filterData.keyword,  //Your text search here
                  "options": "i"
                }
              }
            },
            { "userId.username": { $regex: filterData.keyword, $options: "i" } },
            { title: { $regex: filterData.keyword, $options: "i" } },
            { description: { $regex: filterData.keyword, $options: "i" } },
          ]
        }
      })
    }
    if (filterData?.network?.length !== 0) {
      const token = req.header("Authorization");
      const decoded = token && jwt.verify(token, process.env.jwtSecret);
      const user = decoded?.user
      const currentUser = await User.aggregate([
        {
          $match: { username: user?.username }
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
        }
      ])
      pipeline.push({
        // $match: {
        //   userId: { $in: currentUser[0].followers.map(e => mongoose.Types.ObjectId(e.profile.user._id)) }
        // }
        $match: {
          ...(filterData?.network.includes('TrustsMe') && filterData?.network.includes('TrustedByMe'))
            ? {
              $and: [
                { "userId._id": { $in: currentUser[0].followers.map(e => new mongoose.Types.ObjectId(e.profile.user._id)) } },
                { "userId._id": { $in: currentUser[0].followings.map(e => new mongoose.Types.ObjectId(e.profile.user._id)) } }
              ]
            } :
            filterData?.network.includes('TrustedByMe') ? {
              "userId._id": { $in: currentUser[0].followers.map(e => new mongoose.Types.ObjectId(e.profile.user._id)) }
            } :
              (filterData?.network.includes('TrustsMe') ?
                {
                  "userId._id":
                    { $in: currentUser[0].followings.map(e => new mongoose.Types.ObjectId(e.profile.user._id)) }
                } : {}),
        }
      })
    }
    // const total = await Listing.find(query).countDocuments();
    const total = (await Listing.aggregate(pipeline)).length
    const lists = await Listing.aggregate(pipeline)
    res.send({ total, posts: lists });

  } catch (err) {
    console.log("filter error:", err);
    next(err);
  }
};