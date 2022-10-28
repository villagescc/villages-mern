const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    notificationType: {
      type: String,
      enum: ['PAYMENT', 'TRUST'],
      required: true
    },
    status: {
      type: String,
      enum: ['READ', 'NEW'],
      default: 'NEW'
    },
    notifierProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'profile'
    },
    recipientProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'profile'
    },
    amount: {
      type: Number,
      set: function (v) {
        return Math.round(v * 100) / 100;
      },
    },
    memo: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = Notification = mongoose.model('notification', NotificationSchema);
