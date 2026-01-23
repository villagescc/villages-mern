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

const rateLimitStore = {}; 
exports.Oauth = async (req, res, next) => {
  const requestOrigin = req.headers.origin || req.headers.referer;
  const token = req.header("Authorization");

  //when no token is available
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //verify token
  try {
    const verifyToken = token.replace("Bearer ", "");
    const decoded = jwt.verify(verifyToken, process.env.oauthSecret);

    const clientId = decoded.clientId;

    // Rate limiting logic
    const currentTime = Date.now();
    if (!rateLimitStore[clientId]) {
      rateLimitStore[clientId] = { count: 0, startTime: currentTime };
    }

    const { startTime } = rateLimitStore[clientId];

    if (currentTime - startTime > parseInt(process.env.TIME_WINDOW) ) {
      rateLimitStore[clientId] = { count: 1, startTime: currentTime };
    } else {
      rateLimitStore[clientId].count += 1;

      // Check if the count exceeds the limit
      if (rateLimitStore[clientId].count > parseInt(process.env.RATE_LIMIT)) {
        return res.status(429).json({ message: "You have exceeded the 5 requests in 30 second limit!" });
      }
    }

    req.user = decoded;
    await Log.create({
      user: req.user.user._id,
      log: req.route.path,
      clientID: decoded.clientId,
    });
    const clientSecret = decoded.clientId; // Extract clientSecret from the decoded token
    const developerSetting = await DeveloperSetting.findOne({clientSecret});
    developerSetting.whitelistedEndpoint.push("villages.io")
    const isValidUrl = developerSetting.whitelistedEndpoint.find((url) => requestOrigin?.includes(url))

    if (!isValidUrl) {
      return res.status(401).json({ msg: "Unauthorized, Domain not whitelisted" });
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};