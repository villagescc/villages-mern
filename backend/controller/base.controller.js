const express = require("express");
const Tag = require("../models/Tag");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const User = require("../models/User");

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
