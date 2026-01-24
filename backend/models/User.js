const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['shopkeeper', 'customer'], required: true },
  phone: { type: String },
  shopName: { type: String }, // Only for shopkeepers
  address: { type: String },
  avatar: { type: String },
  bio: { type: String },
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

UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);
