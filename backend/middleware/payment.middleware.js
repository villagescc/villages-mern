const { validatePaymentInput } = require('../validation');

exports.pay = (req, res, next) => {
  const { errors, isValid } = validatePaymentInput(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }
  next();
}
