const mongoose = require('mongoose');

const PaylogSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true
    },
    newBalance: {
      type: Number,
      required: true
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'account'
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'payment'
    },
  },
  {
    timestamps: true
  }
);

module.exports = Paylog = mongoose.model('paylog', PaylogSchema);
