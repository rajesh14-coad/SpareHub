const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  productName: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['Car', 'Bike', 'Electric Car', 'Electric Scooty'], required: true },
  conditionValues: { type: String, enum: ['Old', 'New', 'Any'], default: 'Any' },
  status: { type: String, enum: ['Pending', 'Accepted', 'Denied', 'Fulfilled'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);
