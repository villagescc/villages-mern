const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
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
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    isStaff: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true
  });

module.exports = User = mongoose.model('user', UserSchema);
