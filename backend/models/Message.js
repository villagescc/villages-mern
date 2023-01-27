const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["READ", "NEW"],
      default: "NEW",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    message: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Message = mongoose.model("message", MessageSchema);
