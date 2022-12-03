const { validateEndorsementCreate } = require('../validation');

exports.save = (req, res, next) => {
  const { errors, isValid } = validateEndorsementCreate(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }
  next();
}
