const mongoose = require('mongoose');

const ProfileInvitationSchema = new mongoose.Schema(
  {
    toEmail: {
      type: String,
      required: true
    },
    endorsementWeight: {
      type: Number,
      required: true
    },
    endorsementText: {
      type: String,
    },
    message: {
      type: String,
    },
    code: {
      type: String,
    },
    fromProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = ProfileInvitation = mongoose.model('profile_invitation', ProfileInvitationSchema);
