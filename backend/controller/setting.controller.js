const Setting = require("../models/ProfileSetting");
const User = require("../models/User");

exports.getById = async (req, res, next) => {
  let setting = {};
  try {
    const profileSetting = await Setting.findOne({ user: req.user._id });
    const user = await User.findOne({ _id: req.user._id });
    setting = profileSetting;
    setting = { ...profileSetting._doc, email: user.email };
    res.send(setting);
  } catch (err) {
    next(err);
  }
};
