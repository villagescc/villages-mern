const validateNotificationCreate = require('../validation/notification');

exports.create = (req, res, next) => {
  const { errors, isValid } = validateNotificationCreate(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }
  next();
}
