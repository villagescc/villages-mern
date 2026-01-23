const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    avatar: {
      type: String,
    },
    description: {
      type: String,
    },
    placeId: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    job: {
      type: String,
    },
    headerImage: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    website: {
      type: String,
    },
    tags: [
      {
        listType: {
          type: String,
        },
        tag: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "tag",
        },
      },
    ],
    recentlyActive: {
      type: Date,
      default: new Date()
    },
    recentActivitiesOn: {
      type: [Date],
      default: [new Date().toISOString()]
    }
  },
  {
    timestamps: true,
  }
);

module.exports = Profile = mongoose.model("profile", ProfileSchema);
