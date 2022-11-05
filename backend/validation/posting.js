const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostingCreate(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.type = !isEmpty(data.type) ? data.type : "";

  if (!validator.isLength(data.title, { min: 2, max: 30 })) {
    errors.name = "Title must be between 2 and 30 characters";
  }

  if (validator.isEmpty(data.title)) {
    errors.name = "Title field is required";
  }

  if (validator.isEmpty(data.type)) {
    errors.name = "Type field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
