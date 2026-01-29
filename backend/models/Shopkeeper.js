const mongoose = require('mongoose');

const ShopkeeperSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  shopName: { type: String, required: true },
  shopType: { type: String, required: true },
  specialization: { type: String },
  bio: { type: String },
  isVerified: { type: Boolean, default: false },
  timings: {
    opening: { type: String },
    closing: { type: String },
    workingDays: [{ type: String }]
  },
  contactInfo: {
    phone: { type: String },
    email: { type: String },
    website: { type: String }
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Shopkeeper', ShopkeeperSchema);
