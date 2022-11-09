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
    notifierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
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
