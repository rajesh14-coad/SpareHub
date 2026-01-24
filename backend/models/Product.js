const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  condition: { type: String, enum: ['Old', 'New'], required: true },
  category: { type: String, required: true }, // Removed enum to support custom categories
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  }
}, { timestamps: true });

ProductSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Product', ProductSchema);
