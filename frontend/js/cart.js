// LOADING SCREEN
(function() {
  var messages = [
    'Initializing neural network...',
    'Connecting to MongoDB...',
    'Loading product catalog...',
    'Calibrating AI systems...',
    'Syncing inventory...',
    'Launching NIOA...'
  ];

  var bar = document.getElementById('loader-bar');
  var text = document.getElementById('loader-text');
  var percent = document.getElementById('loader-percent');
  var loader = document.getElementById('loader');

  if (!loader) return;

  var progress = 0;
  var msgIndex = 0;

  var interval = setInterval(function() {
    progress += Math.random() * 8 + 2;
    if (progress > 100) progress = 100;

    if (bar) bar.style.width = progress + '%';
    if (percent) percent.textContent = Math.round(progress) + '%';

    var newMsgIndex = Math.floor((progress / 100) * messages.length);
    if (newMsgIndex !== msgIndex && newMsgIndex < messages.length) {
      msgIndex = newMsgIndex;
      if (text) text.textContent = messages[msgIndex];
    }

    if (progress >= 100) {
      clearInterval(interval);
      if (text) text.textContent = 'Welcome to NIOA';
      setTimeout(function() {
        if (loader) loader.classList.add('hidden');
      }, 600);
    }
  }, 80);
})();

// CART STATE
var cart = [];
try {
  cart = JSON.parse(localStorage.getItem('nioa_cart') || '[]');
} catch(e) {
  cart = [];
  localStorage.removeItem('nioa_cart');
}

var allProducts = [];
var currentFilter = 'all';

// PRODUCT IMAGES
var productImages = {
  'Neural Visor X9':  'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=600&h=600&fit=crop&q=80',
  'Quantum Earbuds':  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop&q=80',
  'HoloWatch Pro':    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80',
  'BioSync Band':     'https://images.unsplash.com/photo-1575827239239109-8a85d602b15b?w=600&h=600&fit=crop&q=80',
  'Plasma Speaker':   'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop&q=80',
  'DronePad Mini':    'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=600&fit=crop&q=80',
  'Smart Jacket AI':  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop&q=80',
  'Holo Projector':   'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=600&fit=crop&q=80',
  'NanoBot Cleaner':  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=600&fit=crop&q=80',
  'AR Glasses Lite':  'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&h=600&fit=crop&q=80'
};

// INIT
async function init() {
  var badge = document.getElementById('badge');
  if (badge) badge.textContent = cart.length;

  try {
    allProducts = await fetchProducts();
    filterAndRender('');
  } catch(e) {
    var grid = document.getElementById('products-grid');
    var label = document.getElementById('products-label');
    if (grid) grid.innerHTML = '<div class="empty-state">Backend not running — start with npm run dev</div>';
    if (label) label.textContent = '0 items';
  }

  var searchEl = document.getElementById('search');
  if (searchEl) {
    searchEl.addEventListener('input', function(e) {
      filterAndRender(e.target.value);
    });
  }

  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      currentFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var s = document.getElementById('search');
      filterAndRender(s ? s.value : '');
    });
  });

  var cartBtn = document.getElementById('cart-btn');
  if (cartBtn) cartBtn.addEventListener('click', openCart);

  updateCartUI();
}

function filterAndRender(query) {
  var q = (query || '').toLowerCase();
  var filtered = allProducts.filter(function(p) {
    return (currentFilter === 'all' || p.category === currentFilter) &&
           p.name.toLowerCase().includes(q);
  });
  var label = document.getElementById('products-label');
  if (label) label.textContent = filtered.length + ' items';
  renderProducts(filtered);
}

function getImageHTML(p) {
  var imgUrl = productImages[p.name];
  if (imgUrl) {
    return '<img src="' + imgUrl + '" alt="' + p.name + '" style="width:100%;height:100%;object-fit:cover;transition:transform 0.4s cubic-bezier(0.4,0,0.2,1);" class="card-photo" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
           '<div style="display:none;align-items:center;justify-content:center;width:100%;height:100%;font-size:72px">' + (p.emoji || '📦') + '</div>';
  }
  return '<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:72px">' + (p.emoji || '📦') + '</div>';
}

function renderProducts(products) {
  var grid = document.getElementById('products-grid');
  if (!grid) return;
  if (!products || products.length === 0) {
    grid.innerHTML = '<div class="empty-state">No products found</div>';
    return;
  }

  grid.innerHTML = products.map(function(p, i) {
    var inCart = cart.some(function(c) { return c._id === p._id; });
    var badge = p.badge === 'new'
      ? '<span class="card-badge badge-new">New</span>'
      : p.badge === 'sale'
      ? '<span class="card-badge badge-sale">Sale</span>'
      : '';

    return '<div class="product-card" style="animation-delay:' + (i * 0.04) + 's" onclick="navigateTo(\'product.html?id=' + p._id + '\')">' +
      '<div class="card-img">' +
        badge +
        '<div class="card-glow"></div>' +
        getImageHTML(p) +
      '</div>' +
      '<div class="card-info">' +
        '<div class="card-cat">' + p.category + '</div>' +
        '<div class="card-name">' + p.name + '</div>' +
        '<div class="card-bottom">' +
          '<div class="card-price">' +
            '<span class="price-now">$' + p.price + '</span>' +
            (p.oldPrice ? '<span class="price-was">$' + p.oldPrice + '</span>' : '') +
          '</div>' +
          '<button class="add-btn ' + (inCart ? 'added' : '') + '" onclick="event.stopPropagation();addToCart(\'' + p._id + '\')">' +
            (inCart ? '✓ Added' : '+ Add') +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  document.querySelectorAll('.card-photo').forEach(function(img) {
    var card = img.closest('.product-card');
    if (!card) return;
    card.addEventListener('mouseenter', function() { img.style.transform = 'scale(1.08)'; });
    card.addEventListener('mouseleave', function() { img.style.transform = 'scale(1)'; });
  });
}

// ADD TO CART (catalog page)
function addToCart(id) {
  var product = allProducts.find(function(p) { return p._id === id; });
  if (!product || cart.some(function(c) { return c._id === id; })) return;
  cart.push(product);
  localStorage.setItem('nioa_cart', JSON.stringify(cart));
  updateCartUI();
  var s = document.getElementById('search');
  filterAndRender(s ? s.value : '');
  showToast(product.name + ' added');
  var badge = document.getElementById('badge');
  if (badge) {
    badge.classList.remove('bump');
    void badge.offsetWidth;
    badge.classList.add('bump');
  }
}

// ADD TO CART (product detail page)
var currentProduct = null;

function addToCartAndOpen(id) {
  var existingCart = JSON.parse(localStorage.getItem('nioa_cart') || '[]');
  if (existingCart.some(function(c) { return c._id === id; })) {
    openCart();
    return;
  }
  if (!currentProduct) return;
  existingCart.push(currentProduct);
  localStorage.setItem('nioa_cart', JSON.stringify(existingCart));
  cart = existingCart;
  var badge = document.getElementById('badge');
  if (badge) badge.textContent = existingCart.length;
  var btn = document.querySelector('.detail-buy-btn');
  if (btn) btn.textContent = '✓ Added to Cart';
  showToast(currentProduct.name + ' added!');
  openCart();
}

// REMOVE FROM CART
function removeFromCart(id) {
  cart = cart.filter(function(c) { return c._id !== id; });
  localStorage.setItem('nioa_cart', JSON.stringify(cart));
  updateCartUI();
  var s = document.getElementById('search');
  if (s) filterAndRender(s.value);
}

// UPDATE CART UI
function updateCartUI() {
  var total = cart.reduce(function(s, p) { return s + p.price; }, 0);
  var badge = document.getElementById('badge');
  var cartTotal = document.getElementById('cart-total');
  var cartCountLabel = document.getElementById('cart-count-label');
  if (badge) badge.textContent = cart.length;
  if (cartTotal) cartTotal.textContent = '$' + total.toLocaleString();
  if (cartCountLabel) cartCountLabel.textContent = cart.length;

  var body = document.getElementById('cart-body');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">◈</div><p>Cart is empty</p></div>';
    return;
  }

  body.innerHTML = cart.map(function(p) {
    var imgUrl = productImages[p.name];
    var imgHTML = imgUrl
      ? '<img src="' + imgUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:2px" onerror="this.style.display=\'none\'">'
      : (p.emoji || '📦');
    return '<div class="cart-item">' +
      '<div class="ci-img">' + imgHTML + '</div>' +
      '<div class="ci-info">' +
        '<div class="ci-name">' + p.name + '</div>' +
        '<div class="ci-price">$' + p.price + '</div>' +
      '</div>' +
      '<button class="ci-remove" onclick="removeFromCart(\'' + p._id + '\')">✕</button>' +
    '</div>';
  }).join('');
}

function openCart() {
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-drawer').classList.add('open');
}

function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-drawer').classList.remove('open');
}

function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = '// ' + msg;
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 2500);
}

async function checkout() {
  if (cart.length === 0) return showToast('Cart is empty');
  if (!getToken()) return loginWithGoogle();
  try {
    var items = cart.map(function(p) { return { product: p._id, name: p.name, price: p.price }; });
    var total = cart.reduce(function(s, p) { return s + p.price; }, 0);
    await placeOrder(items, total);
    cart = [];
    localStorage.setItem('nioa_cart', JSON.stringify(cart));
    updateCartUI();
    closeCart();
    showToast('Order confirmed!');
  } catch(e) {
    showToast('Checkout failed');
  }
}

function handleSubscribe() {
  var input = document.querySelector('.newsletter-input');
  if (input && input.value.includes('@')) {
    showToast('Subscribed — welcome to NIOA!');
    input.value = '';
  } else {
    showToast('Enter a valid email');
  }
}

// HERO ANIMATIONS
function initHero() {
  var tags = ['✦ New Collection 2099', '✦ AI Curated Products', '✦ Drone Delivery Network', '✦ Neural Commerce'];
  var tagIndex = 0;
  var charIndex = 0;
  var tagEl = document.getElementById('hero-tag-text');

  function typeTag() {
    if (!tagEl) return;
    if (charIndex < tags[tagIndex].length) {
      tagEl.textContent += tags[tagIndex][charIndex];
      charIndex++;
      setTimeout(typeTag, 50);
    } else {
      setTimeout(eraseTag, 2000);
    }
  }

  function eraseTag() {
    if (!tagEl) return;
    if (tagEl.textContent.length > 0) {
      tagEl.textContent = tagEl.textContent.slice(0, -1);
      setTimeout(eraseTag, 30);
    } else {
      tagIndex = (tagIndex + 1) % tags.length;
      charIndex = 0;
      setTimeout(typeTag, 300);
    }
  }

  typeTag();

  var words = ['Future', 'Beyond', 'Unknown', 'Neural'];
  var wordIndex = 0;
  var wCharIndex = 0;
  var wordEl = document.getElementById('hero-word');
  var erasing = false;

  function typeWord() {
    if (!wordEl) return;
    if (!erasing) {
      if (wCharIndex < words[wordIndex].length) {
        wordEl.textContent = words[wordIndex].substring(0, wCharIndex + 1);
        wCharIndex++;
        setTimeout(typeWord, 120);
      } else {
        setTimeout(function() { erasing = true; typeWord(); }, 2500);
      }
    } else {
      if (wordEl.textContent.length > 0) {
        wordEl.textContent = wordEl.textContent.slice(0, -1);
        setTimeout(typeWord, 80);
      } else {
        erasing = false;
        wordIndex = (wordIndex + 1) % words.length;
        wCharIndex = 0;
        setTimeout(typeWord, 300);
      }
    }
  }

  if (wordEl) { wordEl.textContent = ''; typeWord(); }

  document.querySelectorAll('.hero-stat-num').forEach(function(el) {
    var target = parseInt(el.getAttribute('data-target'));
    var count = 0;
    var step = Math.ceil(target / 60);
    var timer = setInterval(function() {
      count += step;
      if (count >= target) { count = target; clearInterval(timer); }
      el.textContent = count.toLocaleString();
    }, 30);
  });

  var canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  var particles = [];
  for (var i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      o: Math.random() * 0.4 + 0.1
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function(p) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(77,240,216,' + p.o + ')';
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }

  drawParticles();
}

document.addEventListener('DOMContentLoaded', function() {
  initHero();
  init();
});
