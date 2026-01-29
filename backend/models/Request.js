const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  // Customer Information
  customer: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  customerPhone: { type: String },

  // Part Details
  partName: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  category: {
    type: String,
    enum: ['Car Parts', 'Bike Parts', 'Electric Car Parts', 'Electric Scooty Parts', 'Mobile', 'Tablets', 'Laptops', 'Spare Parts', 'Accessories', 'Electronics'],
    required: true
  },
  condition: {
    type: String,
    enum: ['New', 'Used', 'Reconditioned'],
    required: true
  },
  description: { type: String },

  // Reference Photo (Cloudinary URL)
  referencePhoto: { type: String },

  // Budget Range
  budgetMin: { type: Number, required: true },
  budgetMax: { type: Number, required: true },

  // Location for Broadcasting
  location: {
    state: { type: String, required: true },
    district: { type: String, required: true },
    area: { type: String }
  },

  // Status Tracking
  status: {
    type: String,
    enum: ['Pending', 'Offers Received', 'Closed', 'Expired'],
    default: 'Pending'
  },

  // Shopkeeper Responses/Quotes
  offers: [{
    shopkeeperId: { type: String },
    shopkeeperName: { type: String },
    shopName: { type: String },
    price: { type: Number },
    photo: { type: String },
    message: { type: String },
    respondedAt: { type: Date, default: Date.now }
  }],

  // Auto-Expiry (7 days)
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from creation
  },

  // Metadata
  broadcastedTo: [{ type: String }], // Track which shopkeepers were notified
  viewedBy: [{ type: String }], // Track who viewed the request

}, { timestamps: true });

// Index for auto-expiry cleanup
RequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for location-based queries
RequestSchema.index({ 'location.state': 1, 'location.district': 1, category: 1 });

// Method to check if request is expired
RequestSchema.methods.isExpired = function () {
  return this.expiresAt < new Date();
};

// Static method to mark expired requests
RequestSchema.statics.markExpiredRequests = async function () {
  const now = new Date();
  await this.updateMany(
    { expiresAt: { $lt: now }, status: { $in: ['Pending', 'Offers Received'] } },
    { $set: { status: 'Expired' } }
  );
};

module.exports = mongoose.model('Request', RequestSchema);
