const validator = require("validator");
const isEmpty = require("./is-empty");

exports.validateLoginInput = (data) => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

exports.validateRegisterInput = (data) => {
  let errors = {};

  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!validator.isLength(data.firstName, { min: 2, max: 30 })) {
    errors.name = "First name must be between 2 and 30 characters";
  }

  if (validator.isEmpty(data.firstName)) {
    errors.firstName = "First name field is required";
  }

  if (!validator.isLength(data.lastName, { min: 2, max: 30 })) {
    errors.lastName = "Last name must be between 2 and 30 characters";
  }

  if (validator.isEmpty(data.lastName)) {
    errors.lastName = "Last name field is required";
  }

  if (validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (validator.isEmpty(data.username)) {
    errors.username = "Username field is required";
  }

  if (validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }

  if (validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required";
  }

  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

exports.validateEndorsementCreate = (data) => {
  let errors = {};

  data.recipient = !isEmpty(data.recipient) ? data.recipient : "";
  // data.weight = !isEmpty(data.weight) ? data.weight : 0;

  if (validator.isEmpty(data.recipient)) {
    errors.recipient = "Please choose recipient.";
  }

  if (isEmpty(data.weight)) {
    errors.weight = "Please input Credit limit.";
  }
  else if (parseFloat(data.weight) <= 0) {
    errors.weight = "Credit Limit must be greater 0";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

exports.validatePaymentInput = (data) => {
  let errors = {};

  data.recipient = !isEmpty(data.recipient) ? data.recipient : "";
  data.amount = !isEmpty(data.amount) ? data.amount : 0;

  if (validator.isEmpty(data.recipient)) {
    errors.recipient = "Please choose recipient.";
  }

  if (!(data.amount > 0)) {
    errors.amount = "Please input amount.";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

exports.validateAccountCreate = (data) => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";

  if (validator.isEmpty(data.name)) {
    errors.name = "Account name field is required";
  }

  if (!validator.isLength(data.name, { min: 2, max: 10 })) {
    errors.title = "Account name must be between 2 and 10 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

exports.validateNotificationCreate = (data) => {
  let errors = {};

  data.notificationType = !isEmpty(data.notificationType)
    ? data.notificationType
    : "";
  data.notifierId = !isEmpty(data.notifierId) ? data.notifierId : "";
  data.recipientId = !isEmpty(data.recipientId) ? data.recipientId : "";
  data.amount = !isEmpty(data.amount) ? data.amount : "";

  if (validator.isEmpty(data.notificationType)) {
    errors.notificationType = "Notification type field is required";
  }

  if (validator.isEmpty(data.notifierId)) {
    errors.notifierId = "NotifierId field is required";
  }

  if (validator.isEmpty(data.recipientId)) {
    errors.recipientId = "RecipientId field is required";
  }

  if (validator.isEmpty(data.amount)) {
    errors.amount = "Amount field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

exports.validatePostingCreate = (data) => {
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
    errors.category = "Category field is required";
  }

  if (validator.isEmpty(data.subCategory)) {
    errors.subCategory = "Subcategory field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

exports.validateProfileSave = (data) => {
  let errors = {};

  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.job = !isEmpty(data.job) ? data.job : "";
  data.placeId = !isEmpty(data.placeId) ? data.placeId : "";
  data.zipCode = !isEmpty(data.zipCode) ? data.zipCode : "";
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : "";
  data.website = !isEmpty(data.website) ? data.website : "";

  if (!validator.isLength(data.firstName, { min: 2, max: 30 })) {
    errors.firstName = "First name must be between 2 and 30 characters";
  }

  // if (validator.isEmpty(data.firstName)) {
  //   errors.firstName = "First name field is required";
  // }

  // if (!validator.isLength(data.lastName, { min: 2, max: 30 })) {
  //   errors.lastName = "Last name must be between 2 and 30 characters";
  // }

  // if (validator.isEmpty(data.job)) {
  //   errors.job = "Job field is required";
  // }

  if (validator.isEmpty(data.placeId)) {
    errors.placeId = "Location field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

exports.validateChangePassword = (data) => {
  let errors = {};

  data.oldPassword = !isEmpty(data.oldPassword) ? data.oldPassword : "";
  data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : "";
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : "";

  if (validator.isEmpty(data.oldPassword)) {
    errors.oldPassword = "Current password field is required";
  }

  if (!validator.isLength(data.newPassword, { min: 6, max: 30 })) {
    errors.newPassword = "Password must be at least 6 characters";
  }

  if (validator.isEmpty(data.newPassword)) {
    errors.newPassword = "New password field is required";
  }

  if (!validator.equals(data.newPassword, data.confirmPassword)) {
    errors.confirmPassword = "Passwords must match";
  }

  if (validator.isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "This field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

exports.validateGetPathInput = (data) => {
  let errors = {};

  data.senderId = !isEmpty(data.senderId) ? data.senderId : "";
  data.recipientId = !isEmpty(data.recipientId) ? data.recipientId : "";

  if (validator.isEmpty(data.senderId)) {
    errors.senderId = "Sender must be selected";
  }

  if (validator.isEmpty(data.recipientId)) {
    errors.recipientId = "Recipient must be selected";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

exports.validateSearchTransactionsInput = (data) => {
  let errors = {};

  data.page = !isEmpty(data.page) ? data.page : 0;
  data.period = !isEmpty(data.period) ? data.period : [];

  if (!(data.page > 0)) {
    errors.page = "Please input page number";
  }

  if (data.period.length !== 2) {
    errors.period = "Please input correct period";
  }

  if (
    !(new Date(data.period[0]) instanceof Date) ||
    isNaN(new Date(data.period[0]))
  ) {
    errors.period = "Please choose correct start date";
  }

  if (
    !(new Date(data.period[1]) instanceof Date) ||
    isNaN(new Date(data.period[1]))
  ) {
    errors.period = "Please choose correct end date";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
