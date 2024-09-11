const { validateLoginInput, validateClient } = require("../validation");

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
