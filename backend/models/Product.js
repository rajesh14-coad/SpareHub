const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  condition: { type: String, enum: ['Old', 'New', 'Used'], required: true },
  category: { type: String, required: true },

  // Link to the User (Seller)
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Link to the Shop Profile (for filtering shop-specific products)
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shopkeeper' },

  images: [{ type: String }], // Array of Cloudinary URLs
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
