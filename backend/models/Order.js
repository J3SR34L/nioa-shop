const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items:     [{ product: String, name: String, price: Number }],
  total:     Number,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', OrderSchema);