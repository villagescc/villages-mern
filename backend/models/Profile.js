const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true
  });

module.exports = Profile = mongoose.model('profile', ProfileSchema);
