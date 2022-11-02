const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  Profile.findOne({ userId: req.user.id }).populate('user')
    .then(profile => {
      res.send(profile);
    })
    .catch(err => {
      console.log('find user error', err);
      next(err);
    })
});

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

      await Profile.create({ user: user.id });

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
  User.findOne({ _id: req.params.id, token: req.params.token })
    .then(user => {
      if(!user) return res.status(400).send("Invalid link");
      User.findByIdAndUpdate(user._id, { verified: true })
        .then(() => res.send({success: true, message: "email verified sucessfully"}))
        .catch(err => {
          console.log('update user error', err)
          next(err)
        });
    })
    .catch(err => {
      console.log('find user error')
      next(err)
    });
});

router.post(
  '/login',
  [
    check('email', 'Email or Username is Required').not().isEmpty(),
    check('password', 'Password is Required').not().isEmpty(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password, email } = req.body;

    User.findOne({ $or: [ { email }, { username: email } ] })
      .then(async user => {
        if (!user) {
          return res.status(400).send({
            message: 'Invalid Credentials'
          });
        }

        const profile = await Profile.findOne({ userId: user._id });
        if(!profile) {
          return res.status(400).send({
            message: 'Profile does not exist'
          });
        }

        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return res.status(400).send({
                message: 'Invalid Credentials'
              });
            }

            if(!user.verified) {
              return res.status(400).send({
                message: 'Email is not verified'
              });
            }

            if(!user.isActive) {
              return res.status(400).send({
                message: 'Account is not active'
              });
            }

            const userData = {
              id: user.id,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              verified: user.verified,
              isStaff: user.isStaff,
              ...profile
            }
            const payload = {
              user: userData
            };

            jwt.sign(
              payload,
              process.env.jwtSecret,
              { expiresIn: 3600 },
              (err, serviceToken) => {
                if (err) {
                  console.log('jwt sign error', err);
                  next(err);
                }
                return res.json({ serviceToken, userData });
              }
            );
          })
          .catch(err => {
            console.log('bcrypt compare error', err);
            next(err);
          })
      })
      .catch(err => {
        console.log('find user error', err);
        next(err);
      })
  }
)

module.exports = router;
