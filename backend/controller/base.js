const express = require('express');
const Tag = require('../models/Tag');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

const router = express.Router();

exports.getTags = async (req, res, next) => {
  Tag.find({})
    .then(tags => {
      res.send(tags);
    })
    .catch(err => next(err))
};

exports.getCategories = async (req, res, next) => {
  Category.find({})
    .then(categories => {
      res.send(categories);
    })
    .catch(err => next(err))
};

exports.getSubcategories = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  Subcategory.find(categoryId === "all" ? {} : { categoryId })
    .then(categories => {
      res.send(categories);
    })
    .catch(err => next(err))
};
