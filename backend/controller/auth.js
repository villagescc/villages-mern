const User = require('../models/User');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const profileController = require('./profile');
const paymentController = require('./payment');

const _getUser = async id => {
  return await User.findById(id).populate('profile').populate('account').exec();
}

exports.getUser = async (req, res, next) => {
  try {
    const user = await _getUser(req.user._id);
    res.send(user);
  }
  catch (err) {
    console.log('find user error', err);
    next(err);
  }
}

exports.registerUser = async (req, res, next) => {
  let errors = {};
  let profile, account, user;
  try {
    const { password, username, firstName, lastName, email } = req.body;

    user = await User.findOne({ $or: [ {email}, {username} ] });
    if(user) {
      if(user.email === email) errors.email = 'Email already exists';
      else errors.username = 'Username already exists';

      return res.status(400).send(errors);
    }

    profile = await profileController._createProfile({ name: `${firstName} ${lastName}` });
    account = await paymentController._createAccount();

    const token = crypto.randomBytes(32).toString("hex");
    user = new User({ password, username, firstName, lastName, email, token, profile: profile.id, account: account.id });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // TODO : Send a verification mail
    // const message = `${process.env.BASE_URL}/auth/verify/${user.id}/${token}`;
    // await sendEmail(user.email, "Verify Email", message);

    res.send({success: true, message: "An Email sent to your account. please verify"});
  }
  catch(err) {
    if(profile) await profileController._removeProfileById(profile.id)
    if(account) await paymentController._removeAccountById(profile.id)
    if(user) await User.find({ id: user.id }).remove().exec();
    next(err)
  }
}

exports.verifyToken = async (req, res, next) => {
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
};

exports.login = (req, res, next) => {
  const { password, email } = req.body;

  User.findOne({ $or: [ { email }, { username: email } ] })
    .then(async user => {
      if (!user) {
        return res.status(400).send({
          email: 'This credential does not exist.'
        });
      }

      bcrypt.compare(password, user.password)
        .then(async isMatch => {
          if (!isMatch) {
            return res.status(400).send({
              password: 'Password is incorrect.'
            });
          }

          if(!user.verified) {
            return res.status(400).send({
              email: 'Email is not verified'
            });
          }

          if(!user.isActive) {
            return res.status(400).send({
              email: 'Account is not active'
            });
          }

          const userData = await _getUser(user.id)
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
