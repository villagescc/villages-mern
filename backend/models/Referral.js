const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema(
  {
    referralProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'profile'
    },
    referrerProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'profile'
    },
  },
  {
    timestamps: true
  }
);

module.exports = Referral = mongoose.model('referral', ReferralSchema);
