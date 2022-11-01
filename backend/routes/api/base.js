const express = require('express');
const Tag = require('../../models/Tag');
const Category = require('../../models/Category');

const router = express.Router();

router.get('/tags', async (req, res, next) => {
  Tag.find({})
    .then(tags => {
      res.send(tags);
    })
    .catch(err => next(err))
})

router.get('/categories', async (req, res, next) => {
  Category.find({})
    .then(categories => {
      res.send(categories);
    })
    .catch(err => next(err))
});

module.exports = router;
