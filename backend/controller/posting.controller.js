const fs = require("fs");
const ejs = require('ejs');
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Listing = require("../models/Listing");
const Tag = require("../models/Tag");
const isEmpty = require("../validation/is-empty");
const sharp = require("sharp");
const path = require("path");
const { headingDistanceTo } = require("geolocation-utils");
const Endorsement = require("../models/Endorsement");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Account = require("../models/Account");
const Payment = require("../models/Payment");
const nodemailer = require("nodemailer");
const { _create } = require("./notification.controller");
const { _getMaxFlow, buildGraph } = require("./payment.controller");
const Paylog = require("../models/Paylog");
const sendEmail = require("../utils/email");
const { getAllTrustors, getAllTrustees } = require("./user.controller");

// const sendEmail = async (sender, email, subject, text) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.MAILJET_HOST,
//       // service: process.env.SERVICE,
//       port: 465,
//       auth: {
//         user: process.env.MJ_APIKEY_PUBLIC,
//         pass: process.env.MJ_APIKEY_PRIVATE,
//       },
//     });

//     await transporter.sendMail({
//       from: 'info@villages.io',
//       replyTo: sender,
//       to: email,
//       subject: subject,
//       html: text,
//     });
//     console.log("email sent sucessfully");
//   } catch (error) {
//     console.log("email not sent");
//     console.log(error);
//   }
// };

exports.searchPosts = async (req, res, next) => {
  const { filterData } = req.body;
  const pipeline = [{ $sort: { updatedAt: -1 } }]
  try {
    // const loggedInUser = req.user._id;
    // const total = await Listing.countDocuments();
    // const query = Listing.find().sort({ updatedAt: -1 });
    if (!isEmpty(filterData.filterCategory)) {
      const cate = await Category.findOne({ title: filterData.filterCategory });
      const categoryId = cate._id;
      const subCategories = await Subcategory.find({ categoryId }).lean();
      if (subCategories.length !== 0)
        pipeline.push({ $match: { subcategoryId: { $in: subCategories.map((subCategory) => mongoose.Types.ObjectId(subCategory._id)) } } })
      else if (subCategories.length == 0)
        pipeline.push(
          {
            $lookup: {
              from: "categories",
              foreignField: "_id",
              localField: "categoryId",
              as: "categoryId"
            }
          },
          {
            $addFields: {
              categoryId: { $arrayElemAt: ["$categoryId", 0] },
            }
          },
          {
            $match: {
              "categoryId.title": filterData.filterCategory
            }
          }
        )
      // query
      //   .where("subcategoryId")
      //   .in(subCategories.map((subCategory) => subCategory._id));
    }
    if (!isEmpty(filterData.filterType)) {
      pipeline.push({ $match: { listing_type: filterData.filterType } })
      // query.where("listing_type", filterData.filterType);
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
            filterRadiusUsers.push(mongoose.Types.ObjectId(filterUsers[i]._id));
          }
        }
      }
      // console.log(filterRadiusUsers);
      pipeline.push({ $match: { userId: { $in: filterRadiusUsers } } })
      // query.where("userId").in(filterRadiusUsers);
    }
    if (!isEmpty(filterData.keyword)) {
      // query.or([
      //   { title: { $regex: filterData.keyword, $options: "i" } },
      //   { description: { $regex: filterData.keyword, $options: "i" } },
      // ]);
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: filterData.keyword, $options: "i" } },
            { description: { $regex: filterData.keyword, $options: "i" } }
          ]
        }
      })
    }
    pipeline.push(
      {
        $lookup: {
          from: "categories",
          foreignField: "_id",
          localField: "categoryId",
          as: "categoryId"
        }
      },
      {
        $addFields: {
          categoryId: { $arrayElemAt: ["$categoryId", 0] },
        }
      },
      {
        $match: {
          $or: [
            {
              isSingleTimePurchase: true,
              purchasedBy: {
                $in: [mongoose.Types.ObjectId(req.user._id)],
              },
            },
            {
              "listing_type": {
                $ne: "DIGITAL PRODUCT",
              },
            },
            {
              "listing_type": {
                $eq: "DIGITAL PRODUCT",
              },
              isSingleTimePurchase: false,
            },
            {
              "listing_type": {
                $eq: "DIGITAL PRODUCT",
              },
              isSingleTimePurchase: true,
              purchasedBy: { $size: 0 }
            },
            {
              "listing_type": {
                $eq: "DIGITAL PRODUCT",
              },
              "userId": mongoose.Types.ObjectId(req.user._id)
            }
          ],
        },
      },
      // {
      //   $lookup: {
      //     from: "endorsements",
      //     foreignField: "endorserId",
      //     localField: "_id",
      //     as: "followings",
      //   }
      // },
      {
        $lookup: {
          from: "subcategories",
          foreignField: "_id",
          localField: "subcategoryId",
          as: "subcategoryId",
          pipeline: [
            {
              $lookup: {
                from: "categories",
                foreignField: "_id",
                localField: "categoryId",
                as: "categoryId",
              }
            },
            {
              $addFields: {
                categoryId: { $arrayElemAt: ["$categoryId", 0] },
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "userId",
          pipeline: [
            {
              $lookup: {
                from: "profiles",
                foreignField: "_id",
                localField: "profile",
                as: "profile",
              }
            },
            {
              $addFields: {
                profile: { $arrayElemAt: ["$profile", 0] },
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "tags",
          foreignField: "_id",
          localField: "tags",
          as: "tags",
        }
      },
      {
        $addFields: {
          userId: { $arrayElemAt: ["$userId", 0] },
          subcategoryId: { $arrayElemAt: ["$subcategoryId", 0] },
        }
      }
    )
    if (filterData?.network?.length !== 0) {
      let usersInTrustNetworkAndTrustors = []
      let usersYouTrustAndTheirTrustees = []
      if (filterData?.network.includes('TrustsMe') && filterData?.network.includes('TrustedByMe')) {
        usersYouTrustAndTheirTrustees = await getAllTrustees(req.user)
        usersInTrustNetworkAndTrustors = await getAllTrustors(req.user)
      }
      else if (filterData?.network.includes('TrustsMe')) {
        usersInTrustNetworkAndTrustors = await getAllTrustors(req.user)
      }
      else if (filterData?.network.includes('TrustedByMe')) {
        usersYouTrustAndTheirTrustees = await getAllTrustees(req.user)
      }
      // const token = req.header("Authorization");
      // const decoded = token && jwt.verify(token, process.env.jwtSecret);
      // const user = decoded?.user
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
      //   },
      //   // {
      //   //   $lookup: {
      //   //     from: 'listings',
      //   //     foreignField: "userId",
      //   //     localField: "_id",
      //   //     as: "postings",
      //   //     pipeline: [
      //   //       {
      //   //         $lookup: {
      //   //           from: 'users',
      //   //           foreignField: "_id",
      //   //           localField: "userId",
      //   //           as: "user",
      //   //         }
      //   //       },
      //   //       {
      //   //         $addFields: {
      //   //           "user": { $arrayElemAt: ["$user", 0] }
      //   //         }
      //   //       }
      //   //     ]
      //   //   }
      //   // }
      // ])
      // res.send(currentUser[0].followers.map(e => e.profile.user._id))
      // console.log(currentUser[0]);
      // currentUser[0].followers.map(e => {
      //   console.log(e);
      // })
      pipeline.push({
        // $match: {
        //   userId: { $in: currentUser[0].followers.map(e => mongoose.Types.ObjectId(e.profile.user._id)) }
        // }
        $match: {
          ...(filterData?.network.includes('TrustsMe') && filterData?.network.includes('TrustedByMe'))
            ? {
              $and: [
                { "userId._id": { $in: usersInTrustNetworkAndTrustors?.map(e => mongoose.Types.ObjectId(e)) } },
                { "userId._id": { $in: usersYouTrustAndTheirTrustees?.map(e => mongoose.Types.ObjectId(e)) } }
              ]
            } :
            filterData?.network.includes('TrustedByMe') ? {
              "userId._id": { $in: usersYouTrustAndTheirTrustees?.map(e => mongoose.Types.ObjectId(e)) }
            } :
              (filterData?.network.includes('TrustsMe') ?
                {
                  "userId._id":
                    { $in: usersInTrustNetworkAndTrustors?.map(e => mongoose.Types.ObjectId(e)) }
                } : {}),
        }
      })
      // if (filterData.network.includes('TrustsMe') && filterData.network.includes('TrustedByMe')) {
      //   // query.and([
      //   //   { title: { $regex: filterData.keyword, $options: "i" } },
      //   //   { description: { $regex: filterData.keyword, $options: "i" } },
      //   // ]);
      // }
      // else if (filterData.network.includes('TrustsMe')) {

      // }
      // else {

      // }
      // pipeline.push({
      //   $match: {
      //     ...(filterData?.network.includes('TrustsMe') && filterData?.network.includes('TrustedByMe'))
      //       ? {
      //         "followers.profile.user._id":
      //           { $in: [new mongoose.Types.ObjectId(user?._id)] },
      //         "followings.profile.user._id": { $in: [new mongoose.Types.ObjectId(user?._id)] }
      //       } :
      //       filterData?.network.includes('TrustedByMe') ? {
      //         "followers.profile.user._id": { $in: [new mongoose.Types.ObjectId(user?._id)] }
      //       } :
      //         (filterData?.network.includes('TrustsMe') ?
      //           {
      //             "followings.profile.user._id":
      //               { $in: [new mongoose.Types.ObjectId(user?._id)] }
      //           } : {}),
      //   }
      // })
    }
    // const total = await Listing.find(query).countDocuments();
    const total = (await Listing.aggregate(pipeline)).length
    if (!!!filterData.page) {
      const lists = await Listing.aggregate(pipeline)
      // const lists = await query
      //   .populate({
      //     path: "subcategoryId",
      //     model: "subcategory",
      //     populate: {
      //       path: "categoryId",
      //       model: "category",
      //     },
      //   })
      //   .populate({
      //     path: "userId",
      //     model: "user",
      //     populate: {
      //       path: "profile",
      //       model: "profile",
      //     },
      //   })
      //   .populate("tags")
      //   .exec();
      res.send({ total, posts: lists });
    }
    else {
      if (filterData.page * 12 - 12 > total) filterData.page = 1;
      // query.skip(filterData.page * 12 - 12).limit(12);
      pipeline.push({ $skip: filterData.page * 12 - 12 }, { $limit: 12 })

      // pipeline.push(
      //   // {
      //   //   $lookup: {
      //   //     from: "endorsements",
      //   //     foreignField: "endorserId",
      //   //     localField: "_id",
      //   //     as: "followings",
      //   //   }
      //   // },
      //   {
      //     $lookup: {
      //       from: "subcategories",
      //       foreignField: "_id",
      //       localField: "subcategoryId",
      //       as: "subcategoryId",
      //       pipeline: [
      //         {
      //           $lookup: {
      //             from: "categories",
      //             foreignField: "_id",
      //             localField: "categoryId",
      //             as: "categoryId",
      //           }
      //         },
      //         {
      //           $addFields: {
      //             categoryId: { $arrayElemAt: ["$categoryId", 0] },
      //           }
      //         }
      //       ]
      //     }
      //   },
      //   {
      //     $lookup: {
      //       from: "users",
      //       foreignField: "_id",
      //       localField: "userId",
      //       as: "userId",
      //       pipeline: [
      //         {
      //           $lookup: {
      //             from: "profiles",
      //             foreignField: "_id",
      //             localField: "profile",
      //             as: "profile",
      //           }
      //         },
      //         {
      //           $addFields: {
      //             profile: { $arrayElemAt: ["$profile", 0] },
      //           }
      //         }
      //       ]
      //     }
      //   },
      //   {
      //     $lookup: {
      //       from: "tags",
      //       foreignField: "_id",
      //       localField: "tags",
      //       as: "tags",
      //     }
      //   },
      //   {
      //     $addFields: {
      //       userId: { $arrayElemAt: ["$userId", 0] },
      //       subcategoryId: { $arrayElemAt: ["$subcategoryId", 0] },
      //     }
      //   }
      // )
      // const lists = await query
      //   .populate({
      //     path: "subcategoryId",
      //     model: "subcategory",
      //     populate: {
      //       path: "categoryId",
      //       model: "category",
      //     },
      //   })
      //   .populate({
      //     path: "userId",
      //     model: "user",
      //     populate: {
      //       path: "profile",
      //       model: "profile",
      //     },
      //   })
      //   .populate("tags")
      //   .exec();
      const lists = await Listing.aggregate(pipeline)
      const posts = await Promise.all(
        lists.map(async (list) => {
          const trustId = await Endorsement.aggregate([
            { $match: { recipientId: list?.userId?._id } },
          ]).exec();

          return {
            ...list,
            isTrusted: trustId.length > 0 ? true : false,
          };
        })
      );

      res.send({ total, posts: posts });
    }
  } catch (err) {
    console.log("filter error:", err);
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Listing.findById(id)
      .populate({
        path: "subcategoryId",
        model: "subcategory",
        populate: {
          path: "categoryId",
          model: "category",
        },
      })
      .populate({
        path: "userId",
        model: "user",
        populate: [
          {
            path: "profile",
            model: "profile",
          },
          {
            path: "account",
            model: "account",
          },
        ],
      })
      .populate("tags")
      .exec();
    res.send(post);
  } catch (error) {
    next(error);
  }
};
exports.getByUsernameAndTitle = async (req, res, next) => {
  const token = req.header("Authorization");
  const decoded = token && jwt.verify(token, process.env.jwtSecret);
  try {
    const { username, title } = req.params;
    let post = (await Listing.aggregate([
      { $addFields: { "title": { $trim: { input: "$title" } } } },
      { $match: { title: String(title).trim() } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId"
        }
      },
      {
        $addFields: {
          userId: {
            $arrayElemAt: ["$userId", 0],
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryId"
        }
      },
      {
        $addFields: {
          categoryId: {
            $arrayElemAt: ["$categoryId", 0],
          },
        },
      },
    ]))?.[0]
    if (post?.listing_type === 'DIGITAL PRODUCT') {
      if (decoded) {
        if (post?.purchasedBy?.map(e => e.toString()).includes(decoded?.user._id) || post?.userId?._id?.toString() == decoded?.user?._id) {
          post = await Listing.aggregate([
            { $addFields: { "title": { $trim: { input: "$title" } } } },
            { $match: { title: String(title).trim() } },
            {
              $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "categoryId"
              }
            },
            {
              $addFields: {
                categoryId: {
                  $arrayElemAt: ["$categoryId", 0],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userId"
              }
            },
            {
              $lookup: {
                from: "accounts",
                foreignField: "_id",
                localField: "userId.account",
                as: "account",
              },
            },
            {
              $addFields: {
                account: {
                  $arrayElemAt: ["$account", 0],
                },
              },
            },
            {
              $unwind: { path: "$userId", preserveNullAndEmptyArrays: true }
            },
            {
              $lookup: {
                from: "endorsements",
                let: {
                  userid: "$userId._id"
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
                              mongoose.Types.ObjectId(decoded?.user?._id)
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
                    {
                      $eq: [
                        {
                          $size: "$endorser",
                        },
                        0,
                      ],
                    },
                    0,
                    {
                      $arrayElemAt: ["$endorser.weight", 0],
                    },
                  ],
                },
              },
            },
            {
              $match: { "userId.username": username }
            },
            {
              $lookup: {
                from: "profiles",
                localField: "userId.profile",
                foreignField: "_id",
                as: "userId.profile"
              }
            },
            {
              $unwind: { path: "$userId.profile", preserveNullAndEmptyArrays: true }
            },
            {
              $lookup: {
                from: "subcategories",
                localField: "subcategoryId",
                foreignField: "_id",
                as: "subcategoryId"
              }
            },
            {
              $unwind: { path: "$subcategoryId", preserveNullAndEmptyArrays: true }
            },
            {
              $lookup: {
                from: "categories",
                localField: "subcategoryId.categoryId",
                foreignField: "_id",
                as: "subcategoryId.categoryId"
              }
            },
            {
              $unwind: { path: "$subcategoryId.categoryId", preserveNullAndEmptyArrays: true }
            },
            {
              $lookup: {
                from: "tags",
                localField: "tags",
                foreignField: "_id",
                as: "tags"
              }
            }
          ])
          res.send(post.find(x => x));
        }
        else {
          post = await Listing.aggregate([
            { $addFields: { "title": { $trim: { input: "$title" } } } },
            { $match: { title: String(title).trim() } },
            {
              $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "categoryId"
              }
            },
            {
              $addFields: {
                categoryId: {
                  $arrayElemAt: ["$categoryId", 0],
                },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userId"
              }
            },
            {
              $lookup: {
                from: "accounts",
                foreignField: "_id",
                localField: "userId.account",
                as: "account",
              },
            },
            {
              $addFields: {
                account: {
                  $arrayElemAt: ["$account", 0],
                },
              },
            },
            {
              $unwind: { path: "$userId", preserveNullAndEmptyArrays: true }
            },
            {
              $lookup: {
                from: "endorsements",
                let: {
                  userid: "$userId._id"
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
                              mongoose.Types.ObjectId(decoded?.user?._id)
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
                    {
                      $eq: [
                        {
                          $size: "$endorser",
                        },
                        0,
                      ],
                    },
                    0,
                    {
                      $arrayElemAt: ["$endorser.weight", 0],
                    },
                  ],
                },
              },
            },
            {
              $match: { "userId.username": username }
            },
            {
              $lookup: {
                from: "profiles",
                localField: "userId.profile",
                foreignField: "_id",
                as: "userId.profile"
              }
            },
            {
              $unwind: { path: "$userId.profile", preserveNullAndEmptyArrays: true }
            },
            {
              $lookup: {
                from: "subcategories",
                localField: "subcategoryId",
                foreignField: "_id",
                as: "subcategoryId"
              }
            },
            {
              $unwind: { path: "$subcategoryId", preserveNullAndEmptyArrays: true }
            },
            {
              $lookup: {
                from: "categories",
                localField: "subcategoryId.categoryId",
                foreignField: "_id",
                as: "subcategoryId.categoryId"
              }
            },
            {
              $unwind: { path: "$subcategoryId.categoryId", preserveNullAndEmptyArrays: true }
            },
            {
              $lookup: {
                from: "tags",
                localField: "tags",
                foreignField: "_id",
                as: "tags"
              }
            },
            { $unset: ['paidContent'] }
          ])
          res.send(post.find(x => x));
        }
      }
      else {
        post = await Listing.aggregate([
          { $addFields: { "title": { $trim: { input: "$title" } } } },
          { $match: { title: String(title).trim() } },
          {
            $lookup: {
              from: "categories",
              localField: "categoryId",
              foreignField: "_id",
              as: "categoryId"
            }
          },
          {
            $addFields: {
              categoryId: {
                $arrayElemAt: ["$categoryId", 0],
              },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userId"
            }
          },
          {
            $lookup: {
              from: "accounts",
              foreignField: "_id",
              localField: "userId.account",
              as: "account",
            },
          },
          {
            $addFields: {
              account: {
                $arrayElemAt: ["$account", 0],
              },
            },
          },
          {
            $unwind: { path: "$userId", preserveNullAndEmptyArrays: true }
          },
          {
            $lookup: {
              from: "endorsements",
              let: {
                userid: "$userId._id"
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
                            mongoose.Types.ObjectId(decoded?.user?._id)
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
                  {
                    $eq: [
                      {
                        $size: "$endorser",
                      },
                      0,
                    ],
                  },
                  0,
                  {
                    $arrayElemAt: ["$endorser.weight", 0],
                  },
                ],
              },
            },
          },
          {
            $match: { "userId.username": username }
          },
          {
            $lookup: {
              from: "profiles",
              localField: "userId.profile",
              foreignField: "_id",
              as: "userId.profile"
            }
          },
          {
            $unwind: { path: "$userId.profile", preserveNullAndEmptyArrays: true }
          },
          {
            $lookup: {
              from: "subcategories",
              localField: "subcategoryId",
              foreignField: "_id",
              as: "subcategoryId"
            }
          },
          {
            $unwind: { path: "$subcategoryId", preserveNullAndEmptyArrays: true }
          },
          {
            $lookup: {
              from: "categories",
              localField: "subcategoryId.categoryId",
              foreignField: "_id",
              as: "subcategoryId.categoryId"
            }
          },
          {
            $unwind: { path: "$subcategoryId.categoryId", preserveNullAndEmptyArrays: true }
          },
          {
            $lookup: {
              from: "tags",
              localField: "tags",
              foreignField: "_id",
              as: "tags"
            }
          },
          { $unset: ['paidContent'] }
        ])
        res.send(post.find(x => x));
      }
    }
    else {
      post = await Listing.aggregate([
        { $addFields: { "title": { $trim: { input: "$title" } } } },
        { $match: { title: String(title).trim() } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId"
          }
        },
        {
          $lookup: {
            from: "accounts",
            foreignField: "_id",
            localField: "userId.account",
            as: "account",
          },
        },
        {
          $addFields: {
            account: {
              $arrayElemAt: ["$account", 0],
            },
          },
        },
        {
          $unwind: { path: "$userId", preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: "endorsements",
            let: {
              userid: "$userId._id"
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
                          mongoose.Types.ObjectId(decoded?.user?._id)
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
                {
                  $eq: [
                    {
                      $size: "$endorser",
                    },
                    0,
                  ],
                },
                0,
                {
                  $arrayElemAt: ["$endorser.weight", 0],
                },
              ],
            },
          },
        },
        {
          $match: { "userId.username": username }
        },
        {
          $lookup: {
            from: "profiles",
            localField: "userId.profile",
            foreignField: "_id",
            as: "userId.profile"
          }
        },
        {
          $unwind: { path: "$userId.profile", preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: "subcategories",
            localField: "subcategoryId",
            foreignField: "_id",
            as: "subcategoryId"
          }
        },
        {
          $unwind: { path: "$subcategoryId", preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: "categories",
            localField: "subcategoryId.categoryId",
            foreignField: "_id",
            as: "subcategoryId.categoryId"
          }
        },
        {
          $unwind: { path: "$subcategoryId.categoryId", preserveNullAndEmptyArrays: true }
        },
        {
          $lookup: {
            from: "tags",
            localField: "tags",
            foreignField: "_id",
            as: "tags"
          }
        }
      ])
        .exec();
      res.send(post.find(x => x));
    }
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  let tagId = [];
  let tags = Array.isArray(req.body.tags)
    ? req.body.tags
    : req.body.tags
      ? [req.body.tags]
      : null;
  let listing;
  try {
    if (tags && tags.length > 0) {
      for (let i = 0; i < tags.length; i++) {
        let tag = await Tag.findOne({ title: tags[i] });
        if (tag) tagId.push(tag.id);
        else {
          let newTag = await Tag.create({
            title: tags[i],
          });
          tagId.push(newTag.id);
        }
      }
    }
    if (!isEmpty(req.body.id)) {
      const updateData = {
        title: req.body.title,
        price: req.body.price,
        listing_type: req.body.type,
        paidContent: req.body.paidContent ?? null,
        isSingleTimePurchase: req.body.isSingleTimePurchase ?? null,
        // subcategoryId: req.body.subCategory,
        userId: req.user._id,
        subcategoryId: Boolean(req.body.subCategory) ? req.body.subCategory : null,
        categoryId: Boolean(req.body.category) ? req.body.category : null,
        description: req.body.description,
        tags: tagId,
      };
      if (req.file) {
        let uploadFile = req.file;
        const { filename: image } = req.file;
        try {
          await sharp(req.file.path)
            .resize(600, 300)
            .jpeg({ quality: 60 })
            .toFile(path.resolve(req.file.destination, "resized", image));
          fs.unlinkSync(req.file.path);
        } catch (err) {
          console.log(err);
        }
        updateData.photo = `resized/${uploadFile.filename}`;
      }
      listing = await Listing.findByIdAndUpdate(req.body.id, updateData);
    } else {
      const postData = {
        title: req.body.title,
        price: req.body.price,
        listing_type: req.body.type,
        paidContent: req.body.paidContent ?? null,
        isSingleTimePurchase: req.body.isSingleTimePurchase ?? null,
        // photo: uploadFile ? `resized/${uploadFile.filename}` : null,
        userId: req.user._id,
        subcategoryId: Boolean(req.body.subCategory) ? req.body.subCategory : null,
        categoryId: Boolean(req.body.category) ? req.body.category : null,
        description: req.body.description,
        tags: tagId,
      };
      if (req.file) {
        let uploadFile = req.file;
        const { filename: image } = req.file;
        try {
          await sharp(req.file.path)
            .resize(600, 300)
            .jpeg({ quality: 90 })
            .toFile(path.resolve(req.file.destination, "resized", image));
          fs.unlinkSync(req.file.path);
        } catch (err) {
          console.log(err, "Error");
        }
        postData.photo = `resized/${uploadFile.filename}`;
      }
      listing = await Listing.create(postData);
    }
    res.send(listing);
  } catch (err) {
    console.log("upload error:", err);
    next(err);
  }
};

exports.getByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const postings = await Listing.find({ userId });
    res.send(postings);
  } catch (err) {
    next(err);
  }
};

exports.deleteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Listing.findById(id);
    const path = `./upload/posting/${post?.photo}`;
    const isExist = fs.existsSync(path);
    if (isExist) await fs.unlinkSync(path);
    if (post) await post.remove();
    res.send({ success: true });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.purchase = async (req, res, next) => {
  try {
    const postID = req.body._id;
    const { _id } = req.user;
    const post = await Listing.findOne({ _id: postID }).populate('categoryId').populate('userId')
    if (post.listing_type === 'DIGITAL PRODUCT') {
      if (post?.isSingleTimePurchase) {
        if (!post?.purchasedBy?.includes(_id) && post?.purchasedBy?.length == 0) {
          await Account.findOneAndUpdate({ user: _id }, { $inc: { balance: -post.price } })
          await Account.findOneAndUpdate({ user: post.userId }, { $inc: { balance: post.price } })
          await Listing.findByIdAndUpdate({ _id: postID }, { $push: { purchasedBy: _id } })
          const payment = await Payment.create({ amount: post.price, memo: `Testing digital product https://villages.io/${post?.userId?.username}/${encodeURI(post?.title)}`, payer: _id, recipient: post.userId })
          const result = await _getMaxFlow(_id, post.userId._id, post.price);
          if (result.success) {
            payment.status = 'Completed'
            payment.save()
            await Paylog.insertMany(
              result.paylogs.map((paylog) => ({
                ...paylog,
                paymentId: payment._id,
              })),
              { ordered: false }
            );
            const receiverNotification = await _create(
              "PAYMENT",
              req.user._id,
              post.userId._id,
              post.price,
              `${req.user.username} has just purchased your item`
            );
            const purchaserNotification = await _create(
              "PAYMENT",
              post.userId._id,
              req.user._id,
              post.price,
              `You just purchased ${post.userId.username}'s item`
            );
            global.io.emit("newNotification", purchaserNotification);
            ejs.renderFile('./template/paymentReceiver.ejs', {
              post,
              purchaser: req.user.username
            }, async (error, renderedTemplate) => {
              if (error) {
                console.log('Error rendering template:', error.message);
              } else {
                // Use the renderedTemplate to send the email
                // res.send(renderedTemplate)
                await sendEmail(req.user.email, post.userId.email, `${req.user.username} has just purchased digital product on villages.io`, renderedTemplate)
              }
            })
            ejs.renderFile('./template/purchaseItem.ejs', {
              post
            }, async (error, renderedTemplate) => {
              if (error) {
                console.log('Error rendering template:', error.message);
              } else {
                // Use the renderedTemplate to send the email
                // res.send(renderedTemplate)
                await sendEmail(post.userId.email, req.user.email, 'Your purchased digital product on villages.io', renderedTemplate)
              }
            });
            res.send({ success: true, message: "Item purchased successfully" })
          }
          else {
            await Paylog.deleteMany({ paymentId: payment._id });
            payment.status = "Failed";
            await payment.save();
            res.status(400).send(result.errors);
          }
        }
        else if (!post?.purchasedBy?.includes(_id) && post?.purchasedBy?.length !== 0) {
          res.send({ success: false, message: "You cannot purchase this item" })
        }
        else if (post?.purchasedBy?.includes(_id)) {
          res.send({ success: false, message: "You have already purchased this item" })
        }
      }
      else {
        if (!post?.purchasedBy?.includes(_id)) {
          await Account.findOneAndUpdate({ user: _id }, { $inc: { balance: -post.price } })
          await Account.findOneAndUpdate({ user: post.userId }, { $inc: { balance: post.price } })
          await Listing.findByIdAndUpdate({ _id: postID }, { $push: { purchasedBy: _id } })
          const payment = await Payment.create({ amount: post.price, memo: `Testing digital product https://villages.io/${post?.userId?.username}/${encodeURI(post?.title)}`, payer: _id, recipient: post.userId })
          const result = await _getMaxFlow(_id, post.userId._id, post.price);
          if (result.success) {
            payment.status = 'Completed'
            payment.save()
            await Paylog.insertMany(
              result.paylogs.map((paylog) => ({
                ...paylog,
                paymentId: payment._id,
              })),
              { ordered: false }
            );
            const receiverNotification = await _create(
              "PAYMENT",
              req.user._id,
              post.userId._id,
              post.price,
              `${req.user.username} has just purchased your item`
            );
            const purchaserNotification = await _create(
              "PAYMENT",
              post.userId._id,
              req.user._id,
              post.price,
              `You just purchased ${post.userId.username}'s item`
            );
            global.io.emit("newNotification", purchaserNotification);
            ejs.renderFile('./template/purchaseItem.ejs', {
              post
            }, async (error, renderedTemplate) => {
              if (error) {
                console.log('Error rendering template:', error.message);
              } else {
                await sendEmail(post.userId.email, req.user.email, "Your purchased digital product on villages.io", renderedTemplate)
              }
            });
            ejs.renderFile('./template/paymentReceiver.ejs', {
              post,
              purchaser: req.user.username
            }, async (error, renderedTemplate) => {
              if (error) {
                console.log('Error rendering template:', error.message);
              } else {
                await sendEmail(req.user.email, post.userId.email, `${req.user.username} has just purchased digital product on villages.io`, renderedTemplate)
              }
            })
            res.send({ success: true, message: "Item purchased successfully", post })
          }
          else {
            await Paylog.deleteMany({ paymentId: payment._id });
            payment.status = "Failed";
            await payment.save();
            res.status(400).send(result.errors);
          }
        }
        else if (post?.purchasedBy?.includes(_id)) {
          res.send({ success: false, message: "You have already purchased this item" })
        }
      }
    }
    else
      res.send({ success: false, message: "You cannot purchase this item" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// exports.purchaseLimit = async (req, res, next) => {
//   try {
//     const { postID } = req.body
//     const post = await Listing.findById(postID)
//     if (post) {
//       const user = await User.aggregate([
//         {
//           $facet: {
//             trustedBalance: [
//               {
//                 $match: { "_id": post.userId?._id }
//               },
//               {
//                 $lookup: {
//                   from: "endorsements",
//                   let: {
//                     userid: {
//                       $toObjectId: "$_id",
//                     },
//                   },
//                   pipeline: [
//                     {
//                       $match: {
//                         $expr: {
//                           $and: [
//                             {
//                               $eq: [
//                                 "$recipientId",
//                                 mongoose.Types.ObjectId(req.user._id)
//                               ],
//                             },
//                             {
//                               $eq: [
//                                 "$endorserId",
//                                 "$$userid",
//                               ],
//                             },
//                           ],
//                         },
//                       },
//                     },
//                   ],
//                   as: "endorser",
//                 },
//               },
//               {
//                 $addFields: {
//                   trustedBalance: {
//                     $cond: [
//                       { $eq: [{ $size: "$endorser" }, 0] },
//                       0,
//                       { $arrayElemAt: ["$endorser.weight", 0] },
//                     ],
//                   },
//                 }
//               },
//               {
//                 $project: {
//                   trustedBalance: 1
//                 }
//               }
//             ]
//           }
//         },
//         {
//           $addFields: {
//             trustedBalance: { $arrayElemAt: ['$trustedBalance.trustedBalance', 0] }
//           }
//         },
//         {
//           $project: {
//             trustedBalance: 1
//           }
//         }
//       ])
//       res.send({ success: true, ...user[0] ?? { trustedBalance: 0 } })
//     }
//   } catch (err) {
//     console.log(err);
//     res.send({ success: false })
//     // next(err);
//   }
// };

exports.purchaseLimit = async (req, res, next) => {
  try {
    const { postID } = req.body
    const post = await Listing.findById(postID)
    if (post) {
      // const trustedBalance = await Payment.aggregate([
      //   {
      //     $match: {
      //       recipient: mongoose.Types.ObjectId(post.userId),
      //       payer: mongoose.Types.ObjectId(req.user._id),
      //     }
      //   },
      //   {
      //     $lookup: {
      //       from: "endorsements",
      //       pipeline: [
      //         {
      //           $match: {
      //             $expr: {
      //               $and: [
      //                 {
      //                   $eq: [
      //                     "$recipientId",
      //                     mongoose.Types.ObjectId(req.user._id)
      //                   ],
      //                 },
      //                 {
      //                   $eq: [
      //                     "$endorserId",
      //                     mongoose.Types.ObjectId(post.userId)
      //                   ],
      //                 },
      //               ],
      //             },
      //           },
      //         },
      //       ],
      //       as: "endorser",
      //     }
      //   },
      //   // {
      //   //   $match: {
      //   //     endorser: { $not: { $size: 0 } },
      //   //   }
      //   // },
      //   {
      //     $addFields: {
      //       endorser: {
      //         $arrayElemAt: ["$endorser.weight", 0],
      //       },
      //     }
      //   },
      //   {
      //     $group: {
      //       _id: "$payer",
      //       endorserWeight: { $first: "$endorser" },
      //       sumOfWeight: {
      //         $sum: "$amount",
      //       },
      //     }
      //   },
      //   {
      //     $addFields: {
      //       trustedBalance: {
      //         $subtract: [
      //           "$endorserWeight",
      //           "$sumOfWeight",
      //         ],
      //       },
      //     }
      //   },
      //   {
      //     $project: {
      //       trustedBalance: 1,
      //     }
      //   }
      // ])
      const result = await _getMaxFlow(req.user._id, post.userId);
      if (result.success) {
        res.send({ success: true, trustedBalance: result?.maxLimit })
      }
      else {
        res.send({ success: false, error: result.errors })
      }
    }
  } catch (err) {
    console.log(err);
    res.send({ success: false })
    // next(err);
  }
};