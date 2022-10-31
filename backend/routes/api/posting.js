const express = require('express');
const auth = require('../../middleware/auth');
const Category = require('../../models/Category');
const Listing = require('../../models/Listing');
const { check, validationResult } = require('express-validator');

const router = express.Router();

router.get('/categories', async (req, res, next) => {
  Category.find({})
    .then(categories => {
      res.send(categories);
    })
    .catch(err => next(err))
});

router.post('/posts', async (req, res, next) => {
  Listing.find({})
    .then(lists => {
      res.send(lists);
    })
    .catch(err => next(err))
});

module.exports = router;
