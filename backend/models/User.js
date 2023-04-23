const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
    isSuperuser: {
      type: Boolean,
      default: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
      // unique: true,
    },
    verified: {
      type: Boolean,
      default: false, // TODO mail verification
    },
    isStaff: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profile",
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
    },
    deviceToken: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User = mongoose.model("user", UserSchema);
