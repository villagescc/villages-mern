const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema(
  {
    point: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    neighborhood: {
      type: String,
    },
  },
  {
    timestamps: true
  }
)

module.exports = Location = mongoose.model('location', LocationSchema);
