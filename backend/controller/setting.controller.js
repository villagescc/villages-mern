const Setting = require('../models/ProfileSetting');

exports.getById = async (req, res, next) => {
  try {
    const setting = await Setting.findById(req.user._id);
    res.send(setting);
  }
  catch(err) {
    next(err)
  }
}
