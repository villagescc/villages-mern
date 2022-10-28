const mongoose = require('mongoose');

const EndorsementSchema = new mongoose.Schema(
  {
    weight: {
      type: Number
    },
    text: {
      type: String
    },
    recipientProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'profile'
    },
    endorserProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'profile'
    },
  },
  {
    timestamps: true
  }
);

module.exports = Endorsement = mongoose.model('referral', EndorsementSchema);
