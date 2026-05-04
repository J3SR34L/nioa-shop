require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected!');
  
  await Product.deleteMany();
  
  await Product.insertMany([
    {
      name: 'Neural Visor X9',
      category: 'tech',
      price: 899,
      oldPrice: 1199,
      emoji: '🥽',
      badge: 'sale',
      stars: 5,
      description: 'The Neural Visor X9 is the most advanced mixed reality headset ever created. Featuring direct neural interface technology, 16K resolution per eye, and zero-latency haptic feedback. Experience reality like never before.',
      specs: ['16K per eye resolution', 'Neural interface technology', 'Zero-latency haptics', '8 hour battery life', 'Weight: 180g']
    },
    {
      name: 'Quantum Earbuds',
      category: 'audio',
      price: 349,
      emoji: '🎧',
      badge: 'new',
      stars: 4,
      description: 'Quantum-encrypted audio transmission with AI noise cancellation. These earbuds learn your hearing profile and adapt in real time for the perfect sonic experience.',
      specs: ['Quantum encrypted audio', 'AI noise cancellation', '40hr battery life', 'Wireless charging', 'IPX8 waterproof']
    },
    {
      name: 'HoloWatch Pro',
      category: 'wear',
      price: 599,
      oldPrice: 799,
      emoji: '⌚',
      badge: 'sale',
      stars: 5,
      description: 'The HoloWatch Pro projects a full holographic display from your wrist. Track health metrics, control smart devices, and communicate via hologram.',
      specs: ['Holographic display', 'Health monitoring', 'Smart home control', '5 day battery', 'Titanium body']
    },
    {
      name: 'BioSync Band',
      category: 'health',
      price: 249,
      emoji: '💠',
      badge: 'new',
      stars: 4,
      description: 'Advanced biometric monitoring band that tracks over 200 health indicators in real time. AI-powered health predictions keep you ahead of illness.',
      specs: ['200+ health indicators', 'AI health predictions', 'Blood glucose monitoring', '7 day battery', 'Medical grade sensors']
    },
    {
      name: 'Plasma Speaker',
      category: 'audio',
      price: 479,
      emoji: '🔊',
      stars: 5,
      description: 'Room-filling plasma wave audio technology delivers sound that you feel as much as hear. 360 degree holographic soundstage fills any space.',
      specs: ['Plasma wave technology', '360 soundstage', '500W output', 'Room calibration AI', 'Multi-room sync']
    },
    {
      name: 'DronePad Mini',
      category: 'tech',
      price: 1299,
      emoji: '🚁',
      badge: 'new',
      stars: 4,
      description: 'Personal delivery and surveillance drone that fits in your backpack. Autonomous navigation, 4K camera, and 30 minute flight time.',
      specs: ['30 min flight time', '4K camera', 'Autonomous navigation', '5km range', 'Foldable design']
    },
    {
      name: 'Smart Jacket AI',
      category: 'wear',
      price: 399,
      oldPrice: 499,
      emoji: '🧥',
      badge: 'sale',
      stars: 4,
      description: 'Temperature-regulating smart jacket with built-in AI assistant, solar charging panels, and emergency beacon. The last jacket you will ever need.',
      specs: ['Temperature regulation', 'Solar charging', 'Built-in AI assistant', 'Emergency beacon', 'Self-cleaning fabric']
    },
    {
      name: 'Holo Projector',
      category: 'home',
      price: 799,
      emoji: '🔮',
      stars: 5,
      description: 'Transform any room into an immersive holographic environment. Perfect for entertainment, work presentations, or meditation experiences.',
      specs: ['Full room projection', '8K resolution', '270 degree coverage', 'Voice controlled', 'App ecosystem']
    },
    {
      name: 'NanoBot Cleaner',
      category: 'health',
      price: 299,
      emoji: '🤖',
      badge: 'new',
      stars: 4,
      description: 'Microscopic cleaning robots that eliminate bacteria, viruses, and allergens from any surface at the molecular level. The future of hygiene.',
      specs: ['Molecular cleaning', 'Virus elimination', 'Safe for all surfaces', '1000 sq ft coverage', 'Reusable cartridges']
    },
    {
      name: 'AR Glasses Lite',
      category: 'tech',
      price: 549,
      oldPrice: 699,
      emoji: '👓',
      badge: 'sale',
      stars: 5,
      description: 'Lightweight augmented reality glasses that overlay digital information onto your world. Navigation, translation, and AI assistance always in view.',
      specs: ['All-day AR overlay', 'Real-time translation', 'AI assistant', '12hr battery', 'Prescription compatible']
    }
  ]);

  console.log('Products added with descriptions!');
  mongoose.disconnect();
});