const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      set: function (v) {
        return Math.round(v * 100) / 100;
      },
    },
    listing_type: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategory",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    description: {
      type: String,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profile",
    },
    paidContent: {
      type: String,
      default: null
    },
    isSingleTimePurchase: {
      type: Boolean,
      default: null
    },
    purchasedBy:
    {
      type: [mongoose.Types.ObjectId],
      default: null
    }
    ,
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tag",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = Listing = mongoose.model("listing", ListingSchema);
