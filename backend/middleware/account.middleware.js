const { validateAccountCreate } = require('../validation');

exports.create = (req, res, next) => {
  const { errors, isValid } = validateAccountCreate(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }
  next();
}
