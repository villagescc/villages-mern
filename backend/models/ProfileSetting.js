const mongoose = require("mongoose");

const ProfileSettingSchema = new mongoose.Schema(
  {
    // email: {
    //   type: String,
    //   required: true,
    // },
    // endorsement_limited: {
    //   type: Boolean,
    //   default: false
    // },
    receiveNotifications: {
      type: Boolean,
      default: true,
    },
    receiveUpdates: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
    },
    feedRadius: {
      type: Number,
    },
    // feedTrusted: {
    //   type: Boolean,
    //   default: true
    // },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ProfileSetting = mongoose.model(
  "profile_setting",
  ProfileSettingSchema
);
