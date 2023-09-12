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
const { default: mongoose } = require("mongoose");
const Endorsement = require("../models/Endorsement");

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
          // { firstName: { $regex: keyword, $options: "i" } },
          // { lastName: { $regex: keyword, $options: "i" } },
          { 'profile.description': { $regex: keyword, $options: "i" } },
          { fullName: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
          { username: { $regex: keyword, $options: "i" } },
        ],
      };
    }

    // To find people without any Filter
    // const users = await User.find(query).sort({ createdAt: -1 }).select("username");
    const users = await User.aggregate([
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
        }
      },
      {
        $addFields: {
          fullName: { $concat: ['$firstName', " ", "$lastName"] }
        }
      },
      {
        $match: {
          ...query,
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $project: {
          username: 1
        }
      }
    ])
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
exports.getMostConnectedUsers = async (req, res, next) => {
  const { viewport: { north, east, south, west } } = req.body
  const isValidLatLng = typeof north === 'number' && typeof west === 'number' && typeof south === 'number' && typeof east === 'number'
  const fromDate = new Date(req.body.dateRange[0])
  const toDate = req.body.dateRange[1] ? new Date(req.body.dateRange[1]) : new Date()
  const filterRadiusUsers = [];
  if (isValidLatLng) {
    const filterUsers = await User.find({
      "createdAt": { $gte: fromDate, $lte: toDate },
      latitude: {
        $gte: south,
        $lte: north,
      },
      longitude: {
        $gte: west,
        $lte: east,
      },
    }).select("_id");
    filterRadiusUsers.push(...filterUsers.map(e => e._id))
  }
  const users = await User.aggregate([
    ...(isValidLatLng ? [
      {
        $match: {
          _id: { $in: filterRadiusUsers }
        }
      }
    ] : []),
    // { $limit: 5 },

    {
      $project: {
        _id: 1,
        profile: 1,
        username: 1
      },
    },
    {
      $lookup: {
        from: "endorsements",
        foreignField: "recipientId",
        localField: "_id",
        as: "followers",
        pipeline: [
          {
            $match: {
              weight: {
                $ne: 0,
              },
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "endorsements",
        foreignField: "endorserId",
        localField: "_id",
        as: "followings",
        pipeline: [
          {
            $match: {
              weight: {
                $ne: 0,
              },
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        followers: {
          $size: ["$followers"],
        },
        followings: {
          $size: ["$followings"],
        },
      },
    },
    {
      $sort: {
        followers: -1,
        followings: -1,
      },
    },
    {
      $match: {
        $and: [
          { followers: { $not: { $eq: 0 } } },
          { followings: { $not: { $eq: 0 } } }
        ]
      }
    },
    {
      $limit: 5,
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
              avatar: 1
            }
          }
        ]
      },
    },
    {
      $addFields: {
        profile: {
          $arrayElemAt: ["$profile", 0],
        },
      },
    },
    // {
    //   $lookup: {
    //     from: "users",
    //     foreignField: "_id",
    //     localField: "profile.user",
    //     as: "profile.user",
    //   }
    // },
    // {
    //   $addFields: {
    //     "profile.user": { $arrayElemAt: ["$profile.user", 0] }
    //   }
    // }
  ])
  res.send({ users: users })
};

exports.getMostActiveUsers = async (req, res, next) => {
  const { viewport: { north, east, south, west } } = req.body
  const isValidLatLng = typeof north === 'number' && typeof west === 'number' && typeof south === 'number' && typeof east === 'number'
  const fromDate = new Date(req.body.dateRange[0])
  const toDate = req.body.dateRange[1] ? new Date(req.body.dateRange[1]) : new Date()
  const filterRadiusUsers = [];
  if (isValidLatLng) {
    const filterUsers = await User.find({
      "createdAt": { $gte: fromDate, $lte: toDate },
      latitude: {
        $gte: south,
        $lte: north,
      },
      longitude: {
        $gte: west,
        $lte: east,
      },
    }).select("_id");
    filterRadiusUsers.push(...filterUsers.map(e => e._id))
  }
  const users = await User.aggregate([
    ...(isValidLatLng ? [
      {
        $match: {
          _id: { $in: filterRadiusUsers }
        }
      }
    ] : []),
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
      $match: {
        "profile.recentActivitiesOn": { $exists: true },
        _id: { $not: { $eq: mongoose.Types.ObjectId(req.user._id) } }
      }
    },
    {
      $unwind: "$profile.recentActivitiesOn"
    },
    {
      $addFields: {
        recentActivityDate: {
          $toDate: "$profile.recentActivitiesOn"
        }
      }
    },
    {
      $match: {
        recentActivityDate: {
          $gte: fromDate,
          $lt: toDate
        }
      }
    },
    {
      $group: {
        _id: "$_id",
        user: { $first: "$$ROOT" },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $match: {
        count: { $not: { $eq: 0 } }
      }
    },
    { $limit: 5 },
    { $unset: ['count', 'user.recentActivityDate'] }
  ])
  res.send({ users: users })
}

// exports.getVillagesHours = async (req, res, next) => {
//   const users = await Payment.aggregate([
//     {
//       $facet: {
//         today: [
//           {
//             $match: {
//               status: "Completed",
//               createdAt: {
//                 $gte: new Date(
//                   new Date().setHours(0, 0, 0, 0)
//                 ),
//                 $lt: new Date(
//                   new Date().setHours(
//                     23,
//                     59,
//                     59,
//                     999
//                   )
//                 ),
//               },
//             },
//           },
//           {
//             $group: {
//               _id: null,
//               today: {
//                 $sum: "$amount",
//               },
//             },
//           },
//         ],
//         thisMonth: [
//           {
//             $match: {
//               status: "Completed",
//               createdAt: {
//                 $gte: new Date(
//                   new Date().getFullYear(),
//                   new Date().getMonth(),
//                   1
//                 ),
//                 $lt: new Date(
//                   new Date().getFullYear(),
//                   new Date().getMonth() + 1,
//                   0,
//                   23,
//                   59,
//                   59,
//                   999
//                 ),
//               },
//             },
//           },
//           {
//             $group: {
//               _id: null,
//               thisMonth: {
//                 $sum: "$amount",
//               },
//             },
//           },
//         ],
//         total: [
//           {
//             $match: {
//               status: "Completed",
//             },
//           },
//           {
//             $group: {
//               _id: null,
//               total: {
//                 $sum: "$amount",
//               },
//             },
//           },
//         ],
//       },
//     },
//     {
//       $addFields: {
//         "villageHours.thisMonth": {
//           $cond: [
//             {
//               $eq: [
//                 { $size: "$thisMonth.thisMonth" },
//                 0,
//               ],
//             },
//             0,
//             {
//               $arrayElemAt: [
//                 "$thisMonth.thisMonth",
//                 0,
//               ],
//             },
//           ],
//         },
//         "villageHours.today": {
//           $cond: [
//             { $eq: [{ $size: "$today.today" }, 0] },
//             0,
//             {
//               $arrayElemAt: ["$today.today", 0],
//             },
//           ],
//         },
//         "villageHours.total": {
//           $cond: [
//             { $eq: [{ $size: "$total.total" }, 0] },
//             0,
//             {
//               $arrayElemAt: ["$total.total", 0],
//             },
//           ],
//         },
//       },
//     },
//     {
//       $project: {
//         villageHours: 1,
//       },
//     },
//   ])
//   res.send({ ...users[0] })
// }

exports.getAnalytics = async (req, res, next) => {
  // const { viewport } = req.body
  const { viewport: { north, east, south, west } } = req.body
  const isValidLatLng = typeof north === 'number' && typeof west === 'number' && typeof south === 'number' && typeof east === 'number'
  const fromDate = new Date(req.body.dateRange[0])
  const toDate = req.body.dateRange[1] ? new Date(req.body.dateRange[1]) : new Date()
  // const pipeline = []
  const filterRadiusUsers = [];
  // const [fromDate, toDate] = req.body?.dateRange?.map(dateString => new Date(dateString));
  // if (filterData.radius != "") {
  //   const radius = filterData.radius * 1.609;

  //   const userLocation = await User.findById(req.user._id).select(
  //     "longitude latitude"
  //   );

  //   const centerLocation = {
  //     lat: (typeof latlong.lat === 'number' && typeof latlong.lng === 'number') ? latlong.lat : userLocation.latitude,
  //     lon: (typeof latlong.lat === 'number' && typeof latlong.lng === 'number') ? latlong.lng : userLocation.longitude,
  //   };
  //   const filterUsers = await User.find({ "createdAt": { $gte: fromDate, $lte: toDate } }).select("longitude latitude");
  //   for (var i = 0; i < filterUsers.length; i++) {
  //     if (filterUsers[i].latitude && filterUsers[i].longitude) {
  //       const filterLocation = {
  //         lat: filterUsers[i].latitude,
  //         lon: filterUsers[i].longitude,
  //       };
  //       const result = await headingDistanceTo(
  //         centerLocation,
  //         filterLocation
  //       );
  //       // console.log(Number(result.distance));
  //       if (result.distance < radius) {
  //         filterRadiusUsers.push(mongoose.Types.ObjectId(filterUsers[i]._id));
  //       }
  //     }
  //   }
  //   // pipeline.push({ $match: { _id: { $in: filterRadiusUsers } } })
  // }
  if (isValidLatLng) {
    // const radius = filterData.radius != "" ? filterData.radius : 100000 * 1.609
    // const radius = 100000 * 1.609

    // const userLocation = await User.findById(req.user._id).select(
    //   "longitude latitude"
    // );

    const filterUsers = await User.find({
      "createdAt": { $gte: fromDate, $lte: toDate },
      latitude: {
        $gte: south,
        $lte: north,
      },
      longitude: {
        $gte: west,
        $lte: east,
      },
    }).select("_id");
    filterRadiusUsers.push(...filterUsers.map(e => e._id))
    // for (var i = 0; i < filterUsers.length; i++) {
    //   if (filterUsers[i].latitude && filterUsers[i].longitude) {
    //     const filterLocation = {
    //       lat: filterUsers[i].latitude,
    //       lon: filterUsers[i].longitude,
    //     };
    //     const result = await headingDistanceTo(
    //       centerLocation,
    //       filterLocation
    //     );
    //     // console.log(Number(result.distance));
    //     if (result.distance < radius) {
    //       filterRadiusUsers.push(mongoose.Types.ObjectId(filterUsers[i]._id));
    //     }
    //   }
    // }
    // pipeline.push({ $match: { _id: { $in: filterRadiusUsers } } })
  }
  try {
    const transactions = await Payment.aggregate([
      // (filterRadiusUsers.length !== 0) ? (
      //   {
      //     $match: {
      //       $or: [
      //         { payer: { $in: filterRadiusUsers } },
      //         { recipient: { $in: filterRadiusUsers } }
      //       ]
      //     }
      //   }
      // ) : [],
      ...(isValidLatLng ? [
        {
          $match: {
            $or: [
              { payer: { $in: filterRadiusUsers } },
              { recipient: { $in: filterRadiusUsers } }
            ]
          }
        }
      ] : []),
      {
        $facet: {
          sum: [
            {
              $match: {
                status: "Completed",
                createdAt: {
                  $gte: fromDate,
                  $lt: toDate
                },
              },
            },
            {
              $group: {
                _id: null,
                count: {
                  $sum: 1,
                },
              },
            },
          ],
          total: [
            {
              $match: {
                status: "Completed",
                createdAt: {
                  $gte: fromDate,
                  $lt: toDate
                },
              },
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: "$amount",
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          "analytics.totalTransactions": {
            $cond: [
              {
                $eq: [
                  {
                    $size: "$total.total",
                  },
                  0,
                ],
              },
              0,
              {
                $arrayElemAt: ["$total.total", 0],
              },
            ],
          },
          "analytics.numberOfTransactions": {
            $cond: [
              {
                $eq: [
                  {
                    $size: "$sum.count",
                  },
                  0,
                ],
              },
              0,
              {
                $arrayElemAt: ["$sum.count", 0],
              },
            ],
          },
        },
      },
      {
        $project: {
          analytics: 1,
        },
      },
    ])
    const creditLines = await Endorsement.aggregate([
      ...(isValidLatLng ? [
        {
          $match: {
            $or: [
              { recipientId: { $in: filterRadiusUsers } },
              { endorserId: { $in: filterRadiusUsers } }
            ]
          }
        }
      ] : []),
      {
        $facet: {
          total: [
            {
              $match: {
                createdAt: {
                  $gte: fromDate,
                  $lt: toDate
                },
              }
            },
            {
              $group: {
                _id: null,
                count: {
                  $sum: 1,
                },
                total: {
                  $sum: "$weight",
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          "villageHours.totalCreditLinesUsed": {
            $cond: [
              {
                $eq: [
                  {
                    $size: "$total.total",
                  },
                  0,
                ],
              },
              0,
              {
                $arrayElemAt: ["$total.total", 0],
              },
            ],
          },
          "villageHours.numberOfCreditLinesUsed": {
            $cond: [
              {
                $eq: [
                  {
                    $size: "$total.count",
                  },
                  0,
                ],
              },
              0,
              {
                $arrayElemAt: ["$total.count", 0],
              },
            ],
          },
        },
      },
      {
        $project: {
          villageHours: 1,
        },
      },
    ])
    const users = await User.aggregate([
      ...(isValidLatLng ? [
        {
          $match: {
            _id: { $in: filterRadiusUsers }
          }
        }
      ] : []),
      {
        $match: {
          createdAt: {
            $gte: fromDate,
            $lt: toDate
          },
        }
      },
      {
        $facet: {
          count: [
            {
              $group: {
                _id: null,
                count: {
                  $sum: 1,
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          "newUsers.totalNewUsers": {
            $cond: [
              {
                $eq: [
                  {
                    $size: "$count.count",
                  },
                  0,
                ],
              },
              0,
              {
                $arrayElemAt: ["$count.count", 0],
              },
            ],
          },
        },
      },
      {
        $project: {
          newUsers: 1,
        },
      }
    ])
    const balance = await Account.aggregate([
      ...(isValidLatLng ? [
        {
          $match: {
            user: { $in: filterRadiusUsers }
          }
        }
      ] : []),
      {
        $match: {
          createdAt: {
            $gte: fromDate,
            $lt: toDate
          },
        }
      },
      {
        $group: {
          _id: "$id",
          total: {
            $sum: {
              $cond: [
                {
                  $gt: ["$balance", 0],
                },
                "$balance",
                0,
              ],
            },
          },
        },
      },
      {
        $addFields: {
          "balance.totalCreditInCirculation":
            "$total",
        },
      },
      {
        $project: {
          balance: 1,
          _id: 0,
        },
      }
    ])

    res.send({ analytics: { ...creditLines[0]?.villageHours, ...transactions[0]?.analytics, ...users[0]?.newUsers, ...balance[0]?.balance }, success: true })
  } catch (error) {
    res.send({ success: false, error: error })
  }
}
exports.getRecentPayments = async (req, res, next) => {
  const { viewport: { north, east, south, west } } = req.body
  const { page } = req.body
  const isValidLatLng = typeof north === 'number' && typeof west === 'number' && typeof south === 'number' && typeof east === 'number'
  const fromDate = new Date(req.body.dateRange[0])
  const toDate = req.body.dateRange[1] ? new Date(req.body.dateRange[1]) : new Date()
  const filterRadiusUsers = [];
  if (isValidLatLng) {
    const filterUsers = await User.find({
      "createdAt": { $gte: fromDate, $lte: toDate },
      latitude: {
        $gte: south,
        $lte: north,
      },
      longitude: {
        $gte: west,
        $lte: east,
      },
    }).select("_id");
    filterRadiusUsers.push(...filterUsers.map(e => e._id))
  }
  try {
    const transactions = await Payment.aggregate([
      ...(isValidLatLng ? [
        {
          $match: {
            $or: [
              { payer: { $in: filterRadiusUsers } },
              { recipient: { $in: filterRadiusUsers } }
            ]
          }
        }
      ] : []),
      {
        $sort: { createdAt: -1 }
      },
      {
        $match: {
          status: "Completed"
        }
      },
      // { $skip: page * 10 },
      // { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "payer",
          foreignField: "_id",
          as: "payer",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "recipient",
          foreignField: "_id",
          as: "recipient",
        },
      },
      {
        $addFields: {
          payer: {
            $arrayElemAt: ["$payer", 0],
          },
          recipient: {
            $arrayElemAt: ["$recipient", 0],
          },
        },
      },
    ])
    res.send({ recentPayments: [...transactions].slice((page - 1) * 10, page * 10), success: true, total: transactions?.length ?? 0 })
  } catch (error) {
    res.send({ success: false, error: error })
  }
}