const express = require('express');
const auth = require('../../middleware/auth');
const Listing = require('../../models/Listing');
const { check, validationResult } = require('express-validator');

const router = express.Router();

router.post('/posts', async (req, res, next) => {
  Listing.find({})
    .then(lists => {
      res.send(lists);
    })
    .catch(err => next(err))
});

module.exports = router;
