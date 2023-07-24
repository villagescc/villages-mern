const fs = require("fs");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Listing = require("../models/Listing");
const Tag = require("../models/Tag");
const isEmpty = require("../validation/is-empty");
const sharp = require("sharp");
const path = require("path");
const { headingDistanceTo } = require("geolocation-utils");
const Endorsement = require("../models/Endorsement");


exports.searchPosts = async (req, res, next) => {
  const { filterData } = req.body;
  try {
    // const total = await Listing.countDocuments();
    const query = Listing.find().sort({ updatedAt: -1 });
    if (!isEmpty(filterData.filterCategory)) {
      const cate = await Category.findOne({ title: filterData.filterCategory });
      const categoryId = cate._id;
      const subCategories = await Subcategory.find({ categoryId }).lean();
      query
        .where("subcategoryId")
        .in(subCategories.map((subCategory) => subCategory._id));
    }
    if (!isEmpty(filterData.filterType)) {
      query.where("listing_type", filterData.filterType);
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
      query.where("userId").in(filterRadiusUsers);
    }
    if (!isEmpty(filterData.keyword)) {
      query.or([
        { title: { $regex: filterData.keyword, $options: "i" } },
        { description: { $regex: filterData.keyword, $options: "i" } },
      ]);
    }
    const total = await Listing.find(query).countDocuments();
    if (!!!filterData.page) {
      const lists = await query
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
          populate: {
            path: "profile",
            model: "profile",
          },
        })
        .populate("tags")
        .exec();
      res.send({ total, posts: lists });
    }
    else {
      if (filterData.page * 12 - 12 > total) filterData.page = 1;
      query.skip(filterData.page * 12 - 12).limit(12);
      const lists = await query
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
          populate: {
            path: "profile",
            model: "profile",
          },
        })
        .populate("tags")
        .exec();

      const posts = await Promise.all(
        lists.map(async (list) => {
          const trustId = await Endorsement.aggregate([
            { $match: { recipientId: list?.userId?._id } },
          ]).exec();

          return {
            ...list.toObject(),
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
  try {
    const { username, title } = req.params;
    const post = await Listing.aggregate([
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
        $unwind: { path: "$userId", preserveNullAndEmptyArrays: true }
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
        userId: req.user._id,
        subcategoryId: req.body.subCategory,
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
        // photo: uploadFile ? `resized/${uploadFile.filename}` : null,
        userId: req.user._id,
        subcategoryId: req.body.subCategory,
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
