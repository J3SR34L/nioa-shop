require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected!');
  
  await Product.deleteMany();
  
  await Product.insertMany([
    // ORIGINAL NIOA PRODUCTS
    {
      name: 'Neural Visor X9',
      category: 'tech',
      price: 899,
      oldPrice: 1199,
      emoji: '🥽',
      badge: 'sale',
      stars: 5,
      description: 'The most advanced mixed reality headset ever created. Featuring direct neural interface technology, 16K resolution per eye, and zero-latency haptic feedback.',
      specs: ['16K per eye resolution', 'Neural interface technology', 'Zero-latency haptics', '8 hour battery life', 'Weight: 180g']
    },
    {
      name: 'Quantum Earbuds',
      category: 'audio',
      price: 349,
      emoji: '🎧',
      badge: 'new',
      stars: 4,
      description: 'Quantum-encrypted audio transmission with AI noise cancellation. These earbuds learn your hearing profile and adapt in real time.',
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
      description: 'Room-filling plasma wave audio technology delivers sound that you feel as much as hear. 360 degree holographic soundstage.',
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
      description: 'Temperature-regulating smart jacket with built-in AI assistant, solar charging panels, and emergency beacon.',
      specs: ['Temperature regulation', 'Solar charging', 'Built-in AI assistant', 'Emergency beacon', 'Self-cleaning fabric']
    },
    {
      name: 'Holo Projector',
      category: 'home',
      price: 799,
      emoji: '🔮',
      stars: 5,
      description: 'Transform any room into an immersive holographic environment. Perfect for entertainment, work presentations, or meditation.',
      specs: ['Full room projection', '8K resolution', '270 degree coverage', 'Voice controlled', 'App ecosystem']
    },
    {
      name: 'NanoBot Cleaner',
      category: 'health',
      price: 299,
      emoji: '🤖',
      badge: 'new',
      stars: 4,
      description: 'Microscopic cleaning robots that eliminate bacteria, viruses, and allergens from any surface at the molecular level.',
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
    },

    // ALIENWARE LAPTOPS
    {
      name: 'Alienware m18 R2',
      category: 'tech',
      price: 2999,
      oldPrice: 3499,
      emoji: '💻',
      badge: 'new',
      stars: 5,
      description: 'The most powerful Alienware laptop ever built. Features Intel Core i9-14900HX, NVIDIA RTX 4090 16GB, and an 18-inch QHD+ 240Hz display. Engineered for extreme gaming and content creation without compromise.',
      specs: ['Intel Core i9-14900HX', 'NVIDIA RTX 4090 16GB', '18-inch QHD+ 240Hz', '64GB DDR5 RAM', '4TB NVMe SSD', 'Cherry MX keyboard', 'Windows 11 Home']
    },
    {
      name: 'Alienware x16 R2',
      category: 'tech',
      price: 2499,
      oldPrice: 2799,
      emoji: '💻',
      badge: 'sale',
      stars: 5,
      description: 'Ultra-thin yet powerfully built. The Alienware x16 R2 packs an Intel Core i9 processor and RTX 4080 into a sleek 16-inch chassis with a stunning QHD+ display.',
      specs: ['Intel Core i9-14900HK', 'NVIDIA RTX 4080 12GB', '16-inch QHD+ 240Hz', '32GB DDR5 RAM', '2TB NVMe SSD', 'Per-key RGB keyboard', 'Windows 11 Home']
    },
    {
      name: 'Alienware m16 R2',
      category: 'tech',
      price: 1999,
      oldPrice: 2299,
      emoji: '💻',
      badge: 'sale',
      stars: 4,
      description: 'The perfect balance of performance and portability. The Alienware m16 R2 delivers desktop-class gaming performance in a refined 16-inch form factor.',
      specs: ['Intel Core i7-14700HX', 'NVIDIA RTX 4070 8GB', '16-inch FHD+ 165Hz', '16GB DDR5 RAM', '1TB NVMe SSD', 'RGB backlit keyboard', 'Windows 11 Home']
    },
    {
      name: 'Alienware x14 R2',
      category: 'tech',
      price: 1599,
      oldPrice: 1899,
      emoji: '💻',
      badge: 'sale',
      stars: 4,
      description: 'The thinnest and lightest Alienware ever made. The x14 R2 is the ultimate ultraportable gaming laptop with serious RTX performance in a stunning 14-inch design.',
      specs: ['Intel Core i7-13620H', 'NVIDIA RTX 4060 8GB', '14-inch FHD+ 144Hz', '16GB DDR5 RAM', '512GB NVMe SSD', 'Per-key AlienFX RGB', 'Windows 11 Home']
    },
    {
      name: 'Alienware Area-51m R2',
      category: 'tech',
      price: 3999,
      emoji: '💻',
      badge: 'new',
      stars: 5,
      description: 'The legendary Alienware Area-51m R2 is the desktop replacement that defines ultimate gaming. With full desktop-class Intel Core i9 and NVIDIA RTX graphics, this is the most powerful laptop ever created.',
      specs: ['Intel Core i9-10900K Desktop', 'NVIDIA RTX 2080 Super 8GB', '17.3-inch FHD 144Hz', '64GB DDR4 RAM', '2TB NVMe + 1TB HDD', 'Full mechanical keyboard', 'Dual 330W power adapters']
    }
  ]);

  console.log('All products added successfully!');
  mongoose.disconnect();
});