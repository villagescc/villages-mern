const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true
    },
    memo: {
      type: String
    },
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'account'
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'account'
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Failed'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = Payment = mongoose.model('payment', PaymentSchema);
