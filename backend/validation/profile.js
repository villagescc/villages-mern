const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileSave(data) {
  let errors = {};

  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.job = !isEmpty(data.job) ? data.job : "";
  data.location = !isEmpty(data.location) ? data.location : "";

  if (!validator.isLength(data.firstName, { min: 2, max: 30 })) {
    errors.firstName = "First name must be between 2 and 30 characters";
  }

  if (validator.isEmpty(data.firstName)) {
    errors.firstName = "First name field is required";
  }

  if (!validator.isLength(data.lastName, { min: 2, max: 30 })) {
    errors.lastName = "Last name must be between 2 and 30 characters";
  }

  if (validator.isEmpty(data.job)) {
    errors.job = "Job field is required";
  }

  if (validator.isEmpty(data.location)) {
    errors.location = "Location field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
