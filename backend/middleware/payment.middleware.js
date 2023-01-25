const {
  validatePaymentInput,
  validateGetPathInput,
  validateGetPaymentHistoryInput,
} = require("../validation");

exports.pay = (req, res, next) => {
  const { errors, isValid } = validatePaymentInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  next();
};

exports.getPath = (req, res, next) => {
  const { errors, isValid } = validateGetPathInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  next();
};

exports.getHistory = (req, res, next) => {
  const { errors, isValid } = validateGetPaymentHistoryInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  next();
};
