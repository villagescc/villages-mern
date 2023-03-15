const mongoose = require("mongoose");

const EndorsementSchema = new mongoose.Schema(
  {
    weight: {
      type: Number,
    },
    text: {
      type: String,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    endorserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    referred: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Endorsement = mongoose.model("endorsement", EndorsementSchema);
