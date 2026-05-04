require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected!');
  
  await Product.deleteMany();
  
  await Product.insertMany([
    { name: 'Neural Visor X9', category: 'tech', price: 899, oldPrice: 1199, emoji: '🥽', badge: 'sale', stars: 5 },
    { name: 'Quantum Earbuds', category: 'audio', price: 349, emoji: '🎧', badge: 'new', stars: 4 },
    { name: 'HoloWatch Pro', category: 'wear', price: 599, oldPrice: 799, emoji: '⌚', badge: 'sale', stars: 5 },
    { name: 'BioSync Band', category: 'health', price: 249, emoji: '💠', badge: 'new', stars: 4 },
    { name: 'Plasma Speaker', category: 'audio', price: 479, emoji: '🔊', stars: 5 },
    { name: 'DronePad Mini', category: 'tech', price: 1299, emoji: '🚁', badge: 'new', stars: 4 },
    { name: 'Smart Jacket AI', category: 'wear', price: 399, oldPrice: 499, emoji: '🧥', badge: 'sale', stars: 4 },
    { name: 'Holo Projector', category: 'home', price: 799, emoji: '🔮', stars: 5 },
    { name: 'NanoBot Cleaner', category: 'health', price: 299, emoji: '🤖', badge: 'new', stars: 4 },
    { name: 'AR Glasses Lite', category: 'tech', price: 549, oldPrice: 699, emoji: '👓', badge: 'sale', stars: 5 }
  ]);

  console.log('Products added successfully!');
  mongoose.disconnect();
});