const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    text: {
      type: String
    },
    image: {
      type: String
    },
    deleted: {
      type: Boolean,
      default: false
    },
    want: {
      type: Boolean,
      default: true
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'location'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  },
  {
    timestamps: true
  }
);

module.exports = Post = mongoose.model('post', PostSchema);
