const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

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
  async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      try {
          const { password, username, firstName, lastName, email } = req.body;

          let user = await User.findOne({ email });
          if(user) {
              return res.status(400).json({
                  errors: [{ msg: 'User already exists' }],
              });
          }

          const token = crypto.randomBytes(32).toString("hex");
          user = new User({ password, username, firstName, lastName, email, token });

          const salt = await bcrypt.genSalt(10);

          user.password = await bcrypt.hash(password, salt);

          await user.save();

          const message = `${process.env.BASE_URL}/auth/verify/${user.id}/${token}`;
          await sendEmail(user.email, "Verify Email", message);

          res.send("An Email sent to your account please verify")
      }
      catch(err) {
          res.status(400).send("An error occured");
      }
  }
);

router.get("/verify/:id/:token", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, token: req.params.token });
        if (!user) return res.status(400).send("Invalid link");

        await User.updateOne({ _id: user._id, verified: true });

        res.send("email verified sucessfully");
    } catch (error) {
        res.status(400).send("An error occured");
    }
});

module.exports = router;
