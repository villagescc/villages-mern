const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
    }
  },
  {
    timestamps: true
  }
);

module.exports = Category = mongoose.model('category', CategorySchema);
