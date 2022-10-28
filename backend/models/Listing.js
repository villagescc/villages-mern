const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      set: function (v) {
        return Math.round(v * 100) / 100;
      }
    },
    listingType: {
      type: String,
      required: true
    },
    photo: {
      type: String
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subcategory'
    },
    description: {
      type: String
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'profile'
    },
    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tag'
    }]
  },
  {
    timestamps: true
  }
);

module.exports = Listing = mongoose.model('listing', ListingSchema);
