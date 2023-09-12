const User = require("../models/User");
const Account = require("../models/Account");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Mailjet = require('node-mailjet')

const profileController = require("./profile.controller");
const accountController = require("./account.controller");
// const paymentController = require("./payment.controller");

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE
})

const MailChimp = require("mailchimp-api-v3");
const mailchimp = new MailChimp(process.env.MAILCHIMP_APIKEY);
const listID = process.env.MAILCHIMP_LIST_ID;
// const client = require("@mailchimp/mailchimp_marketing");
// client.setConfig({
//   apiKey: process.env.MAILCHIMP_APIKEY,
//   server: "us2",
// });

const axios = require("axios");
const ProfileSetting = require("../models/ProfileSetting");
const { default: mongoose } = require("mongoose");

const _getUser = async (id) => {
  const user = await User.findById(id).exec();
  if (user) {
    user.account = await Account.findOne({ user: user._id }).exec();
    user.profile = await Profile.findOne({ user: user._id }).exec();
  }

  return user;
};

exports.getUser = async (req, res, next) => {
  try {
    try {
      await Profile.updateOne({ user: mongoose.Types.ObjectId(req.user._id) }, {
        $push: {
          recentActivitiesOn: new Date().toISOString()
        }
      });
    } catch (err) {
      console.log("find user error", err);
      // next(err);
      res.status(500).send({ message: err });
    }
    const user = await _getUser(req.user._id);
    res.send(user);
  } catch (err) {
    console.log("find user error", err);
    next(err);
  }
};

exports.registerUser = async (req, res, next) => {
  let errors = {};
  let profile, account, user;
  try {
    const { password, username, firstName, lastName, email } = req.body;

    user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      if (user.email.toLowerCase() === email.toLowerCase())
        errors.email = "Email already exists";
      else errors.username = "Username already exists";

      return res.status(400).send(errors);
    }

    const token = crypto.randomBytes(32).toString("hex");
    // const verifyCode =
    user = new User({
      password,
      username: username.toLowerCase(),
      firstName,
      lastName,
      email: email.toLowerCase(),
      token,
    });

    profile = await profileController._createProfile({
      user: user._id,
      name: `${firstName} ${lastName}`,
    });
    account = await accountController._createAccount({
      user: user._id,
      balance: 0,
    });

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);
    user.profile = profile._id;
    user.account = account._id;

    const newUser = {
      email_address: email.toLowerCase(),
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    };

    // TO add contacts in mailchimp
    // try {
    //   await mailchimp.post(`/lists/${listID}/members`, newUser)
    // } catch (error) {
    //   console.log(error);
    // }

    //To add contacts in mailjet
    try {
      const request = mailjet
        .post("contactslist", { 'version': 'v3' })
        .id(process.env.MJ_CONTACT_LIST_ID)
        .action("managecontact")
        .request({
          "Name": `${firstName} ${lastName}`,
          "Properties": "object",
          "Action": "addnoforce",
          "Email": email
        })
      request
        .then((result) => {
          console.log(result.body)
        })
        .catch((err) => {
          console.log(err.statusCode)
        })
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }

    user.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({
        success: true,
        message: "User was registered successfully! Please check your email",
      });

      // nodemailer.sendConfirmationEmail(user.username, user.email, user.token);
      axios
        .post(
          "https://us-central1-villages-io-cbb64.cloudfunctions.net/sendMail",
          {
            subject: "Please confirm your account",
            dest: email,
            data: `<h1>Email Confirmation</h1>
              <h2>Hello ${firstName} ${lastName}</h2>
              <p>Thank you for joining our website. Please confirm your email by clicking on the following link</p>
              <a href=https://villages.io/auth/verify/${user._id}/${token}> Click here</a>
              <div>https://villages.io/auth/verify/${user._id}/${token}</div>
              <br>`,
          }
        )
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  } catch (err) {
    if (profile) await profileController._removeProfileById(profile.id);
    if (account) await accountController._removeAccountById(account.id);
    if (user) await User.find({ id: user.id }).remove().exec();
    next(err);
  }
};

exports.verifyToken = async (req, res, next) => {
  User.findOne({ _id: req.params.id, token: req.params.token })
    .then((user) => {
      if (!user) return res.status(400).send("Invalid link");
      User.findByIdAndUpdate(user._id, { verified: true })
        .then(() =>
          res.send({ success: true, message: "email verified sucessfully" })
        )
        .catch((err) => {
          console.log("update user error", err);
          next(err);
        });
    })
    .catch((err) => {
      console.log("find user error");
      next(err);
    });

  const result = new ProfileSetting(
    {
      "receiveNotifications": true,
      "receiveUpdates": true,
      "receiveUser": true,
      "language": "en",
      "feedRadius": 0,
      "user": req.params.id
    }
  );
  await result.save()
};

exports.resendVerificationMail = async (req, res, next) => {
  const email = req.params?.email;
  try {
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { username: email.toLowerCase().trim() }],
    }).exec()
    if (!user) {
      return res.status(400).send({
        email: "This email/username does not exist.",
      });
    }
    axios
      .post(
        "https://us-central1-villages-io-cbb64.cloudfunctions.net/sendMail",
        {
          subject: "Please confirm your account",
          dest: user.email,
          data: `<h1>Email Confirmation</h1>
              <h2>Hello ${user.firstName} ${user.lastName}</h2>
              <p>Thank you for joining our website. Please confirm your email by clicking on the following link</p>
              <a href=https://villages.io/auth/verify/${user._id}/${user.token}> Click here</a>
             <div>https://villages.io/auth/verify/${user._id}/${user.token}</div>
              <br>`,
        }
      )
      .then(function (response) {
        return res.status(200).send({ message: "Email sent successfully" });
      })
      .catch(function (error) {
        return res.status(400).send({ message: "Error sending Email", error: error });
      });

  } catch (error) {
    return res.status(400).send(error)
  }

}

exports.login = (req, res, next) => {
  const { password, email, deviceToken, placeId, latitude, longitude } =
    req.body;
  const { 'user-agent': userAgent } = req.headers
  User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: email.toLowerCase() }],
  })
    .select("+password")
    .then(async (user) => {
      if (!user) {
        return res.status(400).send({
          email: "This credential does not exist.",
        });
      }
      if (user.password) {
        bcrypt
          .compare(password, user.password)
          .then(async (isMatch) => {
            if (!isMatch) {
              return res.status(400).send({
                password: "Password is incorrect.",
              });
            }

            if (!user.verified) {
              return res.status(400).send({
                email: "Email is not verified",
                isEmailVerified: false
              });
            }

            if (!user.isActive) {
              return res.status(400).send({
                email: "Account is not active",
              });
            }

            const userData = await _getUser(user.id);

            if (deviceToken !== "")
              await User.findByIdAndUpdate(user._id, {
                deviceToken,
              });
            if (latitude !== "" && longitude !== "")
              await User.findByIdAndUpdate(user._id, {
                latitude,
                longitude,
              });
            if (placeId !== "")
              await Profile.findOneAndUpdate(
                { user: user._id },
                { placeId: placeId }
              );
            const lastLogin = Date.now();
            await User.findByIdAndUpdate(user._id, { lastLogin });
            const payload = {
              user: {
                _id: userData._id,
                username: userData.username,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                isSuperuser: userData.isSuperuser,
                isStaff: userData.isStaff,
                profile: userData.profile,
                account: userData.account,
                deviceToken: userData.deviceToken,
                latitude: userData.latitude,
                longitude: userData.longitude,
              },
            };

            jwt.sign(
              payload,
              process.env.jwtSecret,
              { expiresIn: userAgent === 'webview' ? "5 years" : 3600 * 24 },
              (err, serviceToken) => {
                if (err) {
                  console.log("jwt sign error", err);
                  next(err);
                }
                return res.json({ serviceToken, user: userData, isFirstTimeLogin: userData?.lastLogin ? false : true });
              }
            );
          })
          .catch((err) => {
            console.log("bcrypt compare error", err);
            next(err);
          });
      } else {
        const salt = await bcrypt.genSalt(10);
        const token = crypto.randomBytes(32).toString("hex");
        user.password = await bcrypt.hash(password, salt);
        user.token = token;
        if (deviceToken !== "") user.deviceToken = deviceToken;
        if (latitude !== "" && longitude !== "") {
          user.latitude = latitude;
          user.longitude = longitude;
        }
        if (placeId !== "")
          await Profile.findOneAndUpdate(
            { user: user._id },
            { placeId: placeId }
          );
        user.lastLogin = Date.now();
        user
          .save()
          .then(() => res.send({ success: true }))
          .catch((err) => next(err));
      }
    })
    .catch((err) => {
      console.log("find user error", err);
      next(err);
    });
};

exports.changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  User.findOne({ _id: req.user._id })
    .select("password")
    .then(async (user) => {
      if (!user) {
        return res.status(400).send({
          oldPassword: "This credential does not exist.",
        });
      }

      bcrypt
        .compare(oldPassword, user.password)
        .then(async (isMatch) => {
          if (!isMatch) {
            return res.status(400).send({
              oldPassword: "Password is incorrect.",
            });
          }

          const salt = await bcrypt.genSalt(10);

          user.password = await bcrypt.hash(newPassword, salt);

          user
            .save()
            .then(() => res.send({ success: true }))
            .catch((err) => next(err));
        })
        .catch((err) => {
          console.log("bcrypt compare error", err);
          next(err);
        });
    })
    .catch((err) => {
      console.log("find user error", err);
      next(err);
    });
};

exports.forgotPassword = async (req, res, next) => {
  console.log("asdfasd");
  const { email } = req.body;
  console.log(email);
  user = User.findOne({ email: email }).then(async (user) => {
    if (!user) {
      return res.status(400).send({
        email: "This email doesn't exist",
      });
    }
    const token = crypto.randomBytes(32).toString("hex");
    User.findByIdAndUpdate(user._id, { token: token })
      .then(() => {
        res.send({
          success: true,
          message: "Please check your email to reset password",
        });
        axios
          .post(
            "https://us-central1-villages-io-cbb64.cloudfunctions.net/sendMail",
            {
              subject: "Please Reset Your Password",
              dest: email,
              data: `<h1>Reseting Password</h1>
                <h2>Hello ${user.firstName} ${user.lastName}</h2>
                <p>Please follow the link to reset your password</p>
                <a href=https://villages.io/auth/forgot-password/${user._id}/${token}> Click here</a>
                <div>https://villages.io/auth/forgot-password/${user._id}/${token}</div>
                <br>`,
            }
          )
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch((err) => {
        console.log("update user error", err);
        next(err);
      });
  });
};

exports.resetPassword = async (req, res, next) => {
  console.log(req.params.id);
  console.log(req.params.token);
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(req.body.password, salt);
  User.findOne({ _id: req.params.id, token: req.params.token })
    .then((user) => {
      if (!user) return res.status(400).send("Invalid link");
      User.findByIdAndUpdate(user._id, { password: password })
        .then(() =>
          res.send({
            success: true,
            message: "Password has been changed successfully",
          })
        )
        .catch((err) => {
          console.log("update user error", err);
          next(err);
        });
    })
    .catch((err) => {
      console.log("find user error");
      next(err);
    });
};
