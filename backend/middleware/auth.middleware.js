const jwt = require("jsonwebtoken");

const { validateRegisterInput, validateLoginInput } = require("../validation");
const Log = require("../models/Log");

exports.register = (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  next();
};

exports.login = (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  next();
};

exports.auth = async (req, res, next) => {
  const token = req.header("Authorization");

  //when no token is available
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //verify token
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);

    req.user = decoded.user;
    await Log.create({
      user: req.user._id,
      log: req.route.path,
    });

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
