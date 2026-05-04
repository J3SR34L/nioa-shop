const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  name:        String,
  category:    String,
  price:       Number,
  oldPrice:    Number,
  emoji:       String,
  badge:       String,
  stars:       Number,
  description: String,
  specs:       [String]
});
module.exports = mongoose.model('Product', ProductSchema);