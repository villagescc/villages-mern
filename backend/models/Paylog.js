const mongoose = require('mongoose');

const PaylogSchema = new mongoose.Schema(
  {
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'account'
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'account'
    },
    amount: {
      type: Number,
      required: true
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
