const express = require('express');
const User = require('../models/User');
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const Listing = require("../models/Listing");
const Tag = require("../models/Tag");
const isEmpty = require("../validation/is-empty");
const { headingDistanceTo } = require("geolocation-utils");


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
          console.log(Number(result.distance));
          if (result.distance < radius) {
            filterRadiusUsers.push(filterUsers[i]._id);
          }
        }
      }
      console.log(filterRadiusUsers);
      query.where("userId").in();
    }
    if (!isEmpty(filterData.keyword)) {
      query.or([
        { title: { $regex: filterData.keyword, $options: "i" } },
        { description: { $regex: filterData.keyword, $options: "i" } },
      ]);
    }
    const total = await Listing.find(query).countDocuments();
    const lists = await query
      .populate({
        path: "userId",
        model: "user",
        populate: {
          path: "profile",
          model: "profile",
        },
      })
      .exec();
    res.send({ total, posts: lists });

  } catch (err) {
    console.log("filter error:", err);
    next(err);
  }
};