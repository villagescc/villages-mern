const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  },
  {
    timestamps: true
  }
);

module.exports = Subcategory = mongoose.model('subcategory', SubcategorySchema);
