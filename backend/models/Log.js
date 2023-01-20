const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    log: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Log = mongoose.model("Log", LogSchema);
