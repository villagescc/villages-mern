const express = require("express");
const Tag = require("../models/Tag");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");

const router = express.Router();

exports.getTags = async (req, res, next) => {
  Tag.find({})
    .then((tags) => {
      res.send(tags);
    })
    .catch((err) => next(err));
};

exports.getCategories = async (req, res, next) => {
  Category.find({})
    .then((categories) => {
      res.send(categories);
    })
    .catch((err) => next(err));
};

exports.getSubcategories = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  Subcategory.find(categoryId === "all" ? {} : { categoryId })
    .then((categories) => {
      res.send(categories);
    })
    .catch((err) => next(err));
};

exports.getRecipients = async (req, res, next) => {
  try {
    const users = await User.find(
      {},
      "id username firstName lastName"
    ).populate("profile", "name");
    res.send(users);
  } catch (err) {
    next(err);
  }
};

// ================= get Oauth Recipients ====================
exports.getOauthRecipients = async (req, res, next) => {
  try {
    const users = await User.aggregate([
      {
        $addFields: {
          joinedAt: "$createdAt"
        }
      },
      {
        $project:
        {
          username: 1,
          profile: 1,
          joinedAt: 1,
          account: 1,
          longitude: 1,
          latitude: 1
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
                _id: 0,
                recentlyActive: 1,
                job: 1,
                placeId: 1,
                avatar: 1,
                name: 1,
                website: 1,
              }
            },
            {
              $addFields: {
                avatar: {
                  $cond: { if: { $eq: [ "$avatar", "" ] }, then: "$avatar", else: {$concat: [ "https://villages.io/upload/avatar/","$avatar"]} }
                }
              }
            }
          ]
        }
      },
      {
        $addFields: {
          profile: {
            $arrayElemAt: ["$profile", 0]
          }
        }
      },
      {
        $lookup:
        {
          from: "endorsements",
          foreignField: "endorserId",
          localField: "_id",
          as: "trustGiven",
          pipeline: [
            {
              $lookup: {
                from: "profiles",
                foreignField: "user",
                localField: "recipientId",
                as: "following",
                pipeline: [
                  {
                    $lookup: {
                      from: "users",
                      foreignField: "_id",
                      localField: "user",
                      as: "username",
                      pipeline: [
                        {
                          $project: {
                            _id: 0,
                            username: 1
                          }
                        }
                      ]
                    }
                  },
                  {
                    $addFields: {
                      username: {
                        $arrayElemAt: [
                          "$username.username",
                          0
                        ]
                      }
                    }
                  },
                  {
                    $project: {
                      _id: 0,
                      name: 1,
                      avatar: 1,
                      username: 1
                    }
                  }
                ]
              }
            },
            {
              $addFields: {
                username: {
                  $arrayElemAt: [
                    "$following.username",
                    0
                  ]
                },
                name: {
                  $arrayElemAt: [
                    "$following.name",
                    0
                  ]
                },
                avatar: {
                  $arrayElemAt: [
                    "$following.avatar",
                    0
                  ],
                },
              }
            },
            {
              $project: {
                username: 1,
                avatar: 1,
                name: 1
              }
            },
            {
              $addFields: {
                avatar: {
                  $cond: { if: { $eq: [ "$avatar", "" ] }, then: "$avatar", else: {$concat: [ "https://villages.io/upload/avatar/","$avatar"]} }
                }
              }
            }
          ]
        }
      },
      {
        $lookup:
        {
          from: "endorsements",
          foreignField: "recipientId",
          localField: "_id",
          as: "trusetdBy",
          pipeline: [
            {
              $lookup: {
                from: "profiles",
                foreignField: "user",
                localField: "endorserId",
                as: "follower",
                pipeline: [
                  {
                    $lookup: {
                      from: "users",
                      foreignField: "_id",
                      localField: "user",
                      as: "username",
                      pipeline: [
                        {
                          $project: {
                            _id: 0,
                            username: 1
                          }
                        }
                      ]
                    }
                  },
                  {
                    $addFields: {
                      username: {
                        $arrayElemAt: [
                          "$username.username",
                          0
                        ]
                      }
                    }
                  },
                  {
                    $project: {
                      _id: 0,
                      name: 1,
                      avatar: 1,
                      username: 1
                    }
                  }
                ]
              }
            },
            {
              $addFields: {
                username: {
                  $arrayElemAt: [
                    "$follower.username",
                    0
                  ]
                },
                name: {
                  $arrayElemAt: [
                    "$follower.name",
                    0
                  ]
                },
                avatar: {
                  $arrayElemAt: [
                    "$follower.avatar",
                    0
                  ]
                }
              }
            },
            {
              $project: {
                username: 1,
                avatar: 1,
                name: 1
              }
            },
            {
              $addFields: {
                avatar: {
                  $cond: { if: { $eq: [ "$avatar", "" ] }, then: "$avatar", else: {$concat: [ "https://villages.io/upload/avatar/","$avatar"]} }
                }
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "endorsements",
          let: {
            userid: {
              $toObjectId: "$_id",
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$recipientId", "$$userid"],
                    },
                    {
                      $eq: ["$endorserId", mongoose.Types.ObjectId(req.user.user._id)],
                    },
                  ],
                },
              },
            },
          ],
          as: "endorser",
        },
      },
      {
        $addFields: {
          trustedBalance: {
            $cond: [
              { $eq: [{ $size: "$endorser" }, 0] },
              0,
              { $arrayElemAt: ["$endorser.weight", 0] },
            ],
          },
        },
      },
      {
        $lookup: {
          from: "accounts",
          foreignField: "_id",
          localField: "account",
          as: "account",
          pipeline: [
            {
              $project: {
                balance: 1,
                _id: 0
              }
            }
          ]
        },
      },
      {
        $addFields: {
          account: { $arrayElemAt: ["$account", 0] },
        },
      },
      {
        $project: {
          endorser: 0
        }
      }
    ])

    res.send(users);
  } catch (err) {
    next(err);
  }
};
