const Notification = require("../models/Notification");
const User = require("../models/User");

exports._create = async (
  notificationType,
  notifierId,
  recipientId,
  amount,
  memo
) => {
  const notification = await Notification.create({
    notificationType,
    notifierId,
    recipientId,
    amount,
    memo,
  });
  return notification;
};

exports.create = async (req, res, next) => {
  const errors = {};
  const { notificationType, notifierId, recipientId, amount, memo } = req.body;
  const notifier = await User.findById(notifierId);

  if (!notifier) {
    errors.notifierId = "This is invalid user.";
    res.status(404).send(errors);
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    errors.recipientId = "This is invalid user.";
    res.status(404).send(errors);
  }

  try {
    const notification = await this._create(
      notificationType,
      notifierId,
      recipientId,
      amount,
      memo
    );
    return res.send(notification);
  } catch (err) {
    next(err);
  }
};

exports.getByUser = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user._id })
      .populate({
        path: "notifierId",
        model: "user",
        populate: { path: "profile", model: "profile" },
      })
      .sort({ createdAt: -1 });
    res.send(notifications);
  } catch (err) {
    next(err);
  }
};

exports.readAllByUser = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user._id },
      { status: "READ" }
    );
    res.send(true);
  } catch (err) {
    next(err);
  }
};

exports.deleteAllByUser = async (req, res, next) => {
  try {
    await Notification.deleteMany({ recipientId: req.user._id });
    res.send(true);
  } catch (err) {
    next(err);
  }
};
