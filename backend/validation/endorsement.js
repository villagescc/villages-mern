const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEndorsementCreate(data) {
  let errors = {};

  data.recipient = !isEmpty(data.recipient) ? data.recipient : "";
  data.weight = !isEmpty(data.weight) ? data.weight : "";

  if (validator.isEmpty(data.recipient)) {
    errors.recipient = "Please choose recipient.";
  }

  if (validator.isEmpty(data.weight)) {
    errors.weight = "Please input weight.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
