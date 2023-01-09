const { validatePaymentInput, validateGetPathInput } = require('../validation');

exports.pay = (req, res, next) => {
  const { errors, isValid } = validatePaymentInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }
  next();
}

exports.getPath = (req, res, next) => {
  const { errors, isValid } = validateGetPathInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }
  next();
}
