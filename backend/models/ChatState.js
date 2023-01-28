const mongoose = require("mongoose");

const ChatStateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    state: {
      type: String,
      enum: ["Online", "Offline", "Do not disturb"],
      default: "Online",
    },
    lastSeen: [
      {
        peer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        time: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = ChatState = mongoose.model("chatState", ChatStateSchema);
