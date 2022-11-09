const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEndorsementCreate(data) {
  let errors = {};

  data.recipient = !isEmpty(data.recipient) ? data.recipient : "";
  data.amount = !isEmpty(data.amount) ? data.amount : "";

  if (validator.isEmpty(data.recipient)) {
    errors.recipient = "Please choose recipient.";
  }

  if (validator.isEmpty(data.amount)) {
    errors.amount = "Please input amount.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
