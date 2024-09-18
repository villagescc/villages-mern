const Log = require("../models/Log");
const {
  validateLoginInput,
  validateClient,
  validateRefreshToken,
} = require("../validation");
const jwt = require("jsonwebtoken");
const DeveloperSetting = require("../models/DevelperSettings");

exports.validateClient = (req, res, next) => {
  const { errors, isValid } = validateClient(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  next();
};

exports.validateLoginInput = (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  next();
};

exports.validateRefreshToken = (req, res, next) => {
  const { errors, isValid } = validateRefreshToken(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  next();
};

const checkDeveloperSetting = async (clientSecret, requestOrigin) => {
  try {
    // Query the DeveloperSetting model to check if the clientSecret matches
    // and the requestOrigin is in the whitelistedEndpoint array
    const developerSetting = await DeveloperSetting.findOne({
      clientSecret,
      whitelistedEndpoint: { $in: [requestOrigin] },
    });

    // Return true if the developer setting exists and origin is allowed, otherwise false
    return !!developerSetting;
  } catch (err) {
    console.error("Error checking developer setting:", err);
    throw new Error("Error while checking developer setting.");
  }
};

exports.Oauth = async (req, res, next) => {
  const token = req.header("Authorization");

  //when no token is available
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //verify token
  try {
    const verifyToken = token.replace("Bearer ", "");
    const decoded = jwt.verify(verifyToken, process.env.oauthSecret);

    req.user = decoded;
    await Log.create({
      user: req.user._id,
      log: req.route.path,
    });
    const clientSecret = decoded.clientId; // Extract clientSecret from the decoded token
    // Construct request origin
    const requestOrigin = req.get("host");
    // Check if the developer setting is valid and origin is whitelisted
    // const isValid = await checkDeveloperSetting(clientSecret, requestOrigin);
    const isValid = true;

    if (!isValid) {
      return res.status(401).json({ msg: "You Are Unauthorized." });
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
