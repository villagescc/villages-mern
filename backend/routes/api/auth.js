const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const router = express.Router();

router.post(
  '/register',
  [
    check('email', 'Email is Required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('username', 'Username is Required').not().isEmpty(),
    check('firstName', 'First name is Required').not().isEmpty(),
    check('lastName', 'Last name is Required').not().isEmpty(),
  ],
  async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      try {
          const { password, username, firstName, lastName, email } = req.body;

          let user = await User.findOne({ $or: [ {email}, {username} ] });
          if(user) {
              return res.status(400).send({
                  message: user.email === email ? 'Email already exists' : 'Username already exists',
              });
          }

          const token = crypto.randomBytes(32).toString("hex");
          user = new User({ password, username, firstName, lastName, email, token });

          const salt = await bcrypt.genSalt(10);

          user.password = await bcrypt.hash(password, salt);

          await user.save();

          // TODO : Send a verification mail
          // const message = `${process.env.BASE_URL}/auth/verify/${user.id}/${token}`;
          // await sendEmail(user.email, "Verify Email", message);

          res.send({success: true, message: "An Email sent to your account please verify"});
      }
      catch(err) {
          next(err)
      }
  }
);

router.get("/verify/:id/:token", async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id, token: req.params.token });
        if (!user) return res.status(400).send("Invalid link");

        await User.updateOne({ _id: user._id, verified: true });

        res.send("email verified sucessfully");
    } catch (error) {
        next(error)
    }
});

module.exports = router;
