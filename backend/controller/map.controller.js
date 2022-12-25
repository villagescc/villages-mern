const express = require('express');
const User = require('../models/User');

const router = express.Router();

exports.getUsers = async (req, res, next) => {
  User.find({})
    .populate('profile')
    .then(users => {
      res.send(users);
    })
    .catch(err => next(err))
};
