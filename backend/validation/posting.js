const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostingCreate(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.type = !isEmpty(data.type) ? data.type : "";
  data.category = !isEmpty(data.category) ? data.category : "";
  data.subCategory = !isEmpty(data.subCategory) ? data.subCategory : "";

  if (!validator.isLength(data.title, { min: 2, max: 30 })) {
    errors.title = "Title must be between 2 and 30 characters";
  }

  if (validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  if (validator.isEmpty(data.type)) {
    errors.type = "Type field is required";
  }

  if (validator.isEmpty(data.category)) {
    errors.category = "Type field is required";
  }

  if (validator.isEmpty(data.subCategory)) {
    errors.subCategory = "Type field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
