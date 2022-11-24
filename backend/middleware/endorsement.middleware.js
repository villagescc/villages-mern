const validateTrustCreate = require('../validation/endorsement');

exports.save = (req, res, next) => {
  const { errors, isValid } = validateTrustCreate(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }
  next();
}
