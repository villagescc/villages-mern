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
const { buildGraph } = require("./payment.controller");


exports.search = async (req, res, next) => {
  const token = req.header("Authorization");
  let { keyword, page, value, network } = req.body;
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
    if (value === "All") {
      const decoded = token && jwt.verify(token, process.env.jwtSecret);
      const user = decoded?.user
      let users = []

      if (network.length !== 0) {
        // const currentUser = await User.aggregate([
        //   {
        //     $match: { username: user?.username }
        //   },
        //   {
        //     $project: { password: 0, token: 0, lastLogin: 0 }
        //   },
        //   {
        //     $lookup: {
        //       from: "profiles",
        //       foreignField: "_id",
        //       localField: "profile",
        //       as: "profile"
        //     }
        //   },
        //   {
        //     $addFields: {
        //       profile: { $arrayElemAt: ["$profile", 0] }
        //     }
        //   },
        //   {
        //     $lookup: {
        //       from: "endorsements",
        //       foreignField: "recipientId",
        //       localField: "_id",
        //       as: "followers",
        //       pipeline: [
        //         {
        //           $match: { weight: { $ne: Number(0) } }
        //         },
        //         {
        //           $sort: { createdAt: -1 }
        //         },
        //         {
        //           $lookup: {
        //             from: "profiles",
        //             foreignField: "user",
        //             localField: "endorserId",
        //             as: "profile",
        //             pipeline: [
        //               {
        //                 $project: { name: 1, avatar: 1, user: 1, placeId: 1, website: 1, zipCode: 1 }
        //               }
        //             ]
        //           }
        //         },
        //         {
        //           $addFields: {
        //             profile: { $arrayElemAt: ["$profile", 0] }
        //           }
        //         },
        //         {
        //           $lookup: {
        //             from: "users",
        //             foreignField: "_id",
        //             localField: "profile.user",
        //             as: "profile.user",
        //             pipeline: [
        //               {
        //                 $project: { username: 1, firstName: 1, lastName: 1, email: 1, profile: 1, job: 1 }
        //               }
        //             ]
        //           }
        //         },
        //         {
        //           $addFields: {
        //             "profile.user": { $arrayElemAt: ["$profile.user", 0] }
        //           }
        //         },
        //         {
        //           $project: { recipientId: 1, endorserId: 1, text: 1, weight: 1, profile: 1 }
        //         }
        //       ]
        //     }
        //   },
        //   {
        //     $lookup: {
        //       from: "endorsements",
        //       foreignField: "endorserId",
        //       localField: "_id",
        //       as: "followings",
        //       pipeline: [
        //         {
        //           $match: { weight: { $ne: Number(0) } }
        //         },
        //         {
        //           $sort: { createdAt: -1 }
        //         },
        //         {
        //           $lookup: {
        //             from: "profiles",
        //             foreignField: "user",
        //             localField: "recipientId",
        //             as: "profile"
        //           }
        //         },
        //         {
        //           $addFields: {
        //             profile: { $arrayElemAt: ["$profile", 0] }
        //           }
        //         },
        //         {
        //           $lookup: {
        //             from: "users",
        //             foreignField: "_id",
        //             localField: "profile.user",
        //             as: "profile.user",
        //           }
        //         },
        //         {
        //           $addFields: {
        //             "profile.user": { $arrayElemAt: ["$profile.user", 0] }
        //           }
        //         }
        //       ]
        //     }
        //   }
        // ])
        const graph = await buildGraph()
        const loggedInUser = user._id;
        let usersInTrustNetworkAndTrustors = []
        let usersYouTrustAndTheirTrustees = []
        if (network.includes('TrustsMe') && network.includes('TrustedByMe')) {
          const trustNetwork = new Set();

          // Create a function to find users you trust and anyone they have trusted
          function findTrustNetworkAndTheirTrustees(user) {
            trustNetwork.add(user);

            // Find trustees (users trusted by the current user)
            const trustees = new Set(graph.outNeighbors(user));

            trustees.forEach((trustee) => {
              if (!trustNetwork.has(trustee)) {
                findTrustNetworkAndTheirTrustees(trustee);
              }
            });
          }

          findTrustNetworkAndTheirTrustees(loggedInUser);

          usersYouTrustAndTheirTrustees = Array.from(trustNetwork);


          const trustNetwork2 = new Set();

          // Perform a depth-first search to find users in the trust network and their trustors
          function findTrustNetworkAndTrustors(user) {
            trustNetwork2.add(user);

            // Find trustors (users who trust the current user)
            const trustors = new Set(graph.neighbors(user));

            trustors.forEach((trustor) => {
              trustNetwork2.add(trustor);
            });

            // Recursively search trustors
            trustors.forEach((trustor) => {
              if (!trustNetwork2.has(trustor)) {
                findTrustNetworkAndTrustors(trustor);
              }
            });
          }

          findTrustNetworkAndTrustors(loggedInUser);

          // Convert the trustNetwork set to an array
          usersYouTrustAndTheirTrustees = Array.from(trustNetwork2);
        }
        else if (network.includes('TrustsMe')) {
          const trustNetwork = new Set();

          // Create a function to find users you trust and anyone they have trusted
          function findTrustNetworkAndTheirTrustees(user) {
            trustNetwork.add(user);

            // Find trustees (users trusted by the current user)
            const trustees = new Set(graph.outNeighbors(user));

            trustees.forEach((trustee) => {
              if (!trustNetwork.has(trustee)) {
                findTrustNetworkAndTheirTrustees(trustee);
              }
            });
          }

          findTrustNetworkAndTheirTrustees(loggedInUser);

          usersYouTrustAndTheirTrustees = Array.from(trustNetwork);
        }
        else if (network.includes('TrustedByMe')) {
          const trustNetwork2 = new Set();
          function findTrustNetworkAndTrustors(user) {
            trustNetwork2.add(user);
            const trustors = new Set(graph.neighbors(user));
            trustors.forEach((trustor) => {
              trustNetwork2.add(trustor);
            });

            trustors.forEach((trustor) => {
              if (!trustNetwork2.has(trustor)) {
                findTrustNetworkAndTrustors(trustor);
              }
            });
          }
          findTrustNetworkAndTrustors(loggedInUser);
          usersInTrustNetworkAndTrustors = Array.from(trustNetwork2);
        }
        query = {
          ...query,
          ...(network.includes('TrustsMe') && network.includes('TrustedByMe'))
            ? {
              $and: [
                { "_id": { $in: usersYouTrustAndTheirTrustees.map(e => new mongoose.Types.ObjectId(e)) } },
                { "_id": { $in: usersInTrustNetworkAndTrustors.map(e => new mongoose.Types.ObjectId(e)) } }
              ]
            } :
            network.includes('TrustedByMe') ? {
              "_id": { $in: usersInTrustNetworkAndTrustors.map(e => new mongoose.Types.ObjectId(e)) }
            } :
              (network.includes('TrustsMe') ?
                {
                  "_id":
                    { $in: usersYouTrustAndTheirTrustees.map(e => new mongoose.Types.ObjectId(e)) }
                } : {}),
        }
        users = await User.aggregate([
          {
            $match: {
              verified: true
            }
          },
          {
            $lookup: {
              from: 'profiles',
              localField: 'profile',
              foreignField: "_id",
              as: 'profile',
              pipeline: [{ $unset: ['website', "createdAt", "placeId", "phoneNumber", "tags", "zipCode"] }]
            }
          },
          {
            $addFields: {
              profile: { $arrayElemAt: ['$profile', 0] },
              fullName: { $concat: ['$firstName', " ", "$lastName"] }
            }
          },
          {
            $match: {
              ...query
            }
          },
          {
            $project: { _id: 1, account: 1, profile: 1, username: 1, email: 1, createdAt: 1, isActive: 1, isSuperuser: 1, verified: 1 }
          },
          {
            $sort: { createdAt: -1 }
          }
        ])
      }
      else {
        users = await User.aggregate([
          {
            $match: {
              verified: true
            }
          },
          {
            $lookup: {
              from: 'profiles',
              localField: 'profile',
              foreignField: "_id",
              as: 'profile',
              pipeline: [{ $unset: ['website', "createdAt", "placeId", "phoneNumber", "tags", "zipCode"] }]
            }
          },
          {
            $addFields: {
              profile: { $arrayElemAt: ['$profile', 0] },
              fullName: { $concat: ['$firstName', " ", "$lastName"] }
            }
          },
          {
            $match: {
              ...query
            }
          },
          {
            $project: { _id: 1, account: 1, profile: 1, username: 1, email: 1, createdAt: 1, isActive: 1, isSuperuser: 1, verified: 1 }
          },

          {
            $sort: { createdAt: -1 }
          }
        ])
      }
      // const users = await User.find({ ...query, verified: true }).sort({ createdAt: -1 }).select("username");
      let filteredUsers = [...users].slice((page - 1) * 10, page * 10);
      // let userData = [];
      let userInfo = []
      // if (network?.length !== 0) {
      userInfo = await getUserDetail(filteredUsers.map(x => x.username), user?._id);
      // }
      // userData.push(userInfo);
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
              if (result.distance < radius && filterUsers[i]._id !== user?._id) {
                filterRadiusUsers.push(mongoose.Types.ObjectId(filterUsers[i]._id));
              }
            }
          }
          // const span1 = Date.now() - span
          // console.log(`fetched- ${span1}`);
        }

        //  To find user Id whom user is following
        const endorserStg1 = await Endorsement.aggregate([
          {
            $match: { endorserId: mongoose.Types.ObjectId(user?._id) }
          },
          {
            $group: { _id: null, receipents: { $push: { $toString: '$recipientId' } } }
          }
        ])
        // Array of Id which contains Following user id
        let endroserData1 = endorserStg1[0]?.receipents ?? []

        //  To find user Id of which user following is following (Web of Trust)
        // A => Following B => B Following C

        const endorserStg2 = await Endorsement.aggregate([
          {
            $match: { endorserId: { $in: endroserData1.map(x => mongoose.Types.ObjectId(x)) } }
          },
          {
            $group: { _id: null, receipents: { $push: { $toString: '$recipientId' } } }
          }
        ])

        //  Array contain user id of web of trust
        //  Data of C will get in endroserData2 variable
        let endroserData2 = endorserStg2[0]?.receipents ?? []

        if (filterRadiusUsers.length) {
          arr = [...new Set([...filterRadiusUsers.map(x => x?.toString())])]
        }
        if (endorserStg2.length) {
          arr = [...new Set([...arr, ...endroserData2])]
        }
        if (filterRadiusUsers.length && endorserStg2.length) {
          arr = [...new Set([...filterRadiusUsers.map(x => x?.toString()), ...endroserData2])]
        }

        arr = arr.filter(x => !endroserData1.includes(x));
        arr = arr.filter(x => x !== user?._id)
      }
      // const users = await User.find(...(arr.length !== 0 ? [{ "_id": { $in: arr }, ...query }] : [query])).sort({ createdAt: -1 }).select("username");
      // const users = await User.find({ "_id": { $in: arr }, ...query }).sort({ createdAt: -1 }).select("username");
      let users = []
      if (network?.length !== 0) {
        // const currentUser = await User.aggregate([
        //   {
        //     $match: { username: user?.username }
        //   },
        //   {
        //     $project: { password: 0, token: 0, lastLogin: 0 }
        //   },
        //   {
        //     $lookup: {
        //       from: "profiles",
        //       foreignField: "_id",
        //       localField: "profile",
        //       as: "profile"
        //     }
        //   },
        //   {
        //     $addFields: {
        //       profile: { $arrayElemAt: ["$profile", 0] }
        //     }
        //   },
        //   {
        //     $lookup: {
        //       from: "endorsements",
        //       foreignField: "recipientId",
        //       localField: "_id",
        //       as: "followers",
        //       pipeline: [
        //         {
        //           $match: { weight: { $ne: Number(0) } }
        //         },
        //         {
        //           $sort: { createdAt: -1 }
        //         },
        //         {
        //           $lookup: {
        //             from: "profiles",
        //             foreignField: "user",
        //             localField: "endorserId",
        //             as: "profile",
        //             pipeline: [
        //               {
        //                 $project: { name: 1, avatar: 1, user: 1, placeId: 1, website: 1, zipCode: 1 }
        //               }
        //             ]
        //           }
        //         },
        //         {
        //           $addFields: {
        //             profile: { $arrayElemAt: ["$profile", 0] }
        //           }
        //         },
        //         {
        //           $lookup: {
        //             from: "users",
        //             foreignField: "_id",
        //             localField: "profile.user",
        //             as: "profile.user",
        //             pipeline: [
        //               {
        //                 $project: { username: 1, firstName: 1, lastName: 1, email: 1, profile: 1, job: 1 }
        //               }
        //             ]
        //           }
        //         },
        //         {
        //           $addFields: {
        //             "profile.user": { $arrayElemAt: ["$profile.user", 0] }
        //           }
        //         },
        //         {
        //           $project: { recipientId: 1, endorserId: 1, text: 1, weight: 1, profile: 1 }
        //         }
        //       ]
        //     }
        //   },
        //   {
        //     $lookup: {
        //       from: "endorsements",
        //       foreignField: "endorserId",
        //       localField: "_id",
        //       as: "followings",
        //       pipeline: [
        //         {
        //           $match: { weight: { $ne: Number(0) } }
        //         },
        //         {
        //           $sort: { createdAt: -1 }
        //         },
        //         {
        //           $lookup: {
        //             from: "profiles",
        //             foreignField: "user",
        //             localField: "recipientId",
        //             as: "profile"
        //           }
        //         },
        //         {
        //           $addFields: {
        //             profile: { $arrayElemAt: ["$profile", 0] }
        //           }
        //         },
        //         {
        //           $lookup: {
        //             from: "users",
        //             foreignField: "_id",
        //             localField: "profile.user",
        //             as: "profile.user",
        //           }
        //         },
        //         {
        //           $addFields: {
        //             "profile.user": { $arrayElemAt: ["$profile.user", 0] }
        //           }
        //         }
        //       ]
        //     }
        //   }
        // ])

        const graph = await buildGraph()
        const loggedInUser = user._id;
        let usersInTrustNetworkAndTrustors = []
        let usersYouTrustAndTheirTrustees = []
        if (network.includes('TrustsMe') && network.includes('TrustedByMe')) {
          const trustNetwork = new Set();

          // Create a function to find users you trust and those who trust them
          function findTrustNetworkAndTheirTrustees(user) {
            const queue = [user];

            while (queue.length > 0) {
              const currentNode = queue.shift();

              if (!trustNetwork.has(currentNode)) {
                trustNetwork.add(currentNode);

                // Find trustees (users trusted by the current user)
                const trustees = new Set(graph.outNeighbors(currentNode));

                trustees.forEach((trustee) => {
                  queue.push(trustee);
                });

                // Find trustors (users who trust the current user)
                const trustors = new Set(graph.inNeighbors(currentNode));

                trustors.forEach((trustor) => {
                  queue.push(trustor);
                });
              }
            }
          }

          findTrustNetworkAndTheirTrustees(loggedInUser);

          // Convert the trustNetwork set to an array
          usersInTrustNetworkAndTrustors = Array.from(trustNetwork);


          const trustNetwork2 = new Set();

          // Perform a depth-first search to find users in the trust network and their trustors
          function findTrustNetworkAndTrustors(user) {
            trustNetwork2.add(user);

            // Find trustors (users who trust the current user)
            const trustors = new Set(graph.neighbors(user));

            trustors.forEach((trustor) => {
              trustNetwork2.add(trustor);
            });

            // Recursively search trustors
            trustors.forEach((trustor) => {
              if (!trustNetwork2.has(trustor)) {
                findTrustNetworkAndTrustors(trustor);
              }
            });
          }

          findTrustNetworkAndTrustors(loggedInUser);

          // Convert the trustNetwork set to an array
          usersYouTrustAndTheirTrustees = Array.from(trustNetwork2);
        }
        else if (network.includes('TrustsMe')) {
          const trustNetwork = new Set();

          // Create a function to find users you trust and anyone they have trusted
          function findTrustNetworkAndTheirTrustees(user) {
            trustNetwork.add(user);

            // Find trustees (users trusted by the current user)
            const trustees = new Set(graph.outNeighbors(user));

            trustees.forEach((trustee) => {
              if (!trustNetwork.has(trustee)) {
                findTrustNetworkAndTheirTrustees(trustee);
              }
            });
          }

          findTrustNetworkAndTheirTrustees(loggedInUser);

          usersYouTrustAndTheirTrustees = Array.from(trustNetwork);
        }
        else if (network.includes('TrustedByMe')) {
          const trustNetwork2 = new Set();
          function findTrustNetworkAndTrustors(user) {
            trustNetwork2.add(user);
            const trustors = new Set(graph.neighbors(user));
            trustors.forEach((trustor) => {
              trustNetwork2.add(trustor);
            });

            trustors.forEach((trustor) => {
              if (!trustNetwork2.has(trustor)) {
                findTrustNetworkAndTrustors(trustor);
              }
            });
          }
          findTrustNetworkAndTrustors(loggedInUser);
          usersInTrustNetworkAndTrustors = Array.from(trustNetwork2);
        }

        // console.log(currentUser[0].followers.map(e => new mongoose.Types.ObjectId(e.profile.user._id)));
        users = await User.aggregate([
          {
            $lookup: {
              from: 'profiles',
              localField: 'profile',
              foreignField: "_id",
              as: 'profile',
              pipeline: [{ $unset: ['website', "createdAt", "placeId", "phoneNumber", "tags", "zipCode"] }]
            }
          },
          {
            $match: {
              _id: { $in: arr.map(e => mongoose.Types.ObjectId(e)) },
            }
          },
          {
            $addFields: {
              profile: { $arrayElemAt: ['$profile', 0] },
              fullName: { $concat: ['$firstName', " ", '$lastName'] }
            }
          },
          { $match: { ...query } },
          {
            $match: {
              ...(network.includes('TrustsMe') && network.includes('TrustedByMe'))
                ? {
                  $and: [
                    { "_id": { $in: usersYouTrustAndTheirTrustees.map(e => new mongoose.Types.ObjectId(e)) } },
                    { "_id": { $in: usersInTrustNetworkAndTrustors.map(e => new mongoose.Types.ObjectId(e)) } }
                  ]
                } :
                network.includes('TrustedByMe') ? {
                  "_id": { $in: usersInTrustNetworkAndTrustors.map(e => new mongoose.Types.ObjectId(e)) }
                } :
                  (network.includes('TrustsMe') ?
                    {
                      "_id":
                        { $in: usersYouTrustAndTheirTrustees.map(e => new mongoose.Types.ObjectId(e)) }
                    } : {}),
              verified: true
            }
          },
          {
            $project: { _id: 1, account: 1, profile: 1, username: 1, email: 1, createdAt: 1, isActive: 1, isSuperuser: 1, verified: 1 }
          },
          {
            $sort: {
              createdAt: -1
            }
          },
        ])
      }
      else {
        users = await User.aggregate([
          {
            $lookup: {
              from: 'profiles',
              localField: 'profile',
              foreignField: "_id",
              as: 'profile',
              pipeline: [{ $unset: ['website', "createdAt", "placeId", "phoneNumber", "tags", "zipCode"] }]
            }
          },
          {
            $addFields: {
              profile: { $arrayElemAt: ['$profile', 0] },
              fullName: { $concat: ['$firstName', " ", '$lastName'] }
            }
          },
          {
            $match: {
              ...query,
              _id: { $in: arr.map(e => mongoose.Types.ObjectId(e)) },
              verified: true
            }
          },
          {
            $project: { _id: 1, account: 1, profile: 1, username: 1, email: 1, createdAt: 1, isActive: 1, isSuperuser: 1, verified: 1 }
          },
          {
            $sort: {
              createdAt: -1
            }
          }
        ])
      }
      let filteredUsers = [...users].slice((page - 1) * 10, page * 10);
      let userInfo = [];
      userInfo = await getUserDetail(filteredUsers.map(x => x.username), user?._id);
      // userData.push(userInfo);
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
  const token = req.header("Authorization");
  const decoded = token && jwt.verify(token, process.env.jwtSecret);
  try {
    const user = await getUserDetailByUserName(req.params.username, decoded?.user?._id);
    user?.length ? res.send(...user) : res.send({})
  } catch (err) {
    next(err);
  }
};

const getUserDetail = async (username, _id) => {
  const user = await User.aggregate([
    {
      $match: { "username": { $in: username } }
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
                    $eq: [
                      "$recipientId",
                      "$$userid",
                    ],
                  },
                  {
                    $eq: [
                      "$endorserId",
                      mongoose.Types.ObjectId(_id)
                    ],
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
      $project: { _id: 1, account: 1, profile: 1, username: 1, email: 1, createdAt: 1, isActive: 1, isSuperuser: 1, verified: 1, endorser: 1 }
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
      $addFields: {
        trustedBalance: {
          $cond: [
            { $eq: [{ $size: "$endorser" }, 0] },
            0,
            { $arrayElemAt: ["$endorser.weight", 0] },
          ],
        },
      }
    },
    { $unset: ['endorser'] },
    {
      $sort: { createdAt: -1 }
    }
  ])
  // const span = Date.now() - start;
  // console.log(`fetched ${user._id} - ${span}`);
  return user;
};

const getUserDetailByUserName = async (username, _id) => {
  const user = await User.aggregate([
    {
      $match: { username }
    },
    {
      $project: { password: 0, token: 0, lastLogin: 0 }
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
                    $eq: [
                      "$recipientId",
                      "$$userid",
                    ],
                  },
                  {
                    $eq: [
                      "$endorserId",
                      mongoose.Types.ObjectId(_id)
                    ],
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
      }
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
    const { email, notificationCheck, updateCheck, userCheck, language, feedRadius } =
      req.body;

    let user = await User.findOne({ _id: req.user._id });
    let profileSetting = await ProfileSetting.findOne({ user: req.user._id });
    if (profileSetting) {
      profileSetting.receiveNotifications = notificationCheck;
      profileSetting.receiveUpdates = updateCheck;
      profileSetting.receiveUser = userCheck;
      profileSetting.feedRadius = feedRadius;
      profileSetting.language = language;
      profileSetting.user = req.user._id;
      await profileSetting.save();
    } else {
      await ProfileSetting.create({
        receiveNotifications: notificationCheck,
        receiveUpdates: updateCheck,
        receiveUser: userCheck,
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
