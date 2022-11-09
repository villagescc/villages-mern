const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateNotificationCreate(data) {
  let errors = {};

  data.notificationType = !isEmpty(data.notificationType) ? data.notificationType : "";
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
    isValid: isEmpty(errors)
  };
};
