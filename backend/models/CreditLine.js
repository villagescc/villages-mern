const mongoose = require('mongoose');

const CreditLineSchema = new mongoose.Schema(
  {
    limit: {
      type: Number,
      required: true
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'account'
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'account'
    },
    type: {
      type: Number,
      enum: [1, -1],
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = CreditLine = mongoose.model('credit_line', CreditLineSchema);
