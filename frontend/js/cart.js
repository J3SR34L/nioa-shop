let cart = [];
let allProducts = [];
let currentFilter = 'all';

// Real product images from Unsplash (matching each product)
var productImages = {
  'Neural Visor X9':   'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=600&h=600&fit=crop&q=80',
  'Quantum Earbuds':   'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop&q=80',
  'HoloWatch Pro':     'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80',
  'BioSync Band':      'https://images.unsplash.com/photo-1575827239239109-8a85d602b15b?w=600&h=600&fit=crop&q=80',
  'Plasma Speaker':    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop&q=80',
  'DronePad Mini':     'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=600&fit=crop&q=80',
  'Smart Jacket AI':   'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop&q=80',
  'Holo Projector':    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=600&fit=crop&q=80',
  'NanoBot Cleaner':   'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=600&fit=crop&q=80',
  'AR Glasses Lite':   'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&h=600&fit=crop&q=80'
};

async function init() {
  try {
    allProducts = await fetchProducts();
    filterAndRender('');
  } catch(e) {
    document.getElementById('products-grid').innerHTML =
      '<div class="empty-state">Backend not running — start with npm run dev</div>';
    document.getElementById('products-label').textContent = '0 items';
  }

  document.getElementById('search').addEventListener('input', function(e) {
    filterAndRender(e.target.value);
  });

  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      currentFilter = btn.dataset.filter;
      document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      filterAndRender(document.getElementById('search').value);
    });
  });

  document.getElementById('cart-btn').addEventListener('click', openCart);
}

function filterAndRender(query) {
  var q = (query || '').toLowerCase();
  var filtered = allProducts.filter(function(p) {
    return (currentFilter === 'all' || p.category === currentFilter) &&
           p.name.toLowerCase().includes(q);
  });
  document.getElementById('products-label').textContent = filtered.length + ' items';
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
    return '<div class="product-card" style="animation-delay:' + (i * 0.04) + 's">' +
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
          '<button class="add-btn ' + (inCart ? 'added' : '') + '" onclick="addToCart(\'' + p._id + '\')">' +
            (inCart ? '✓ Added' : '+ Add') +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  // Add hover zoom to photos
  document.querySelectorAll('.card-photo').forEach(function(img) {
    img.closest('.product-card').addEventListener('mouseenter', function() {
      img.style.transform = 'scale(1.08)';
    });
    img.closest('.product-card').addEventListener('mouseleave', function() {
      img.style.transform = 'scale(1)';
    });
  });
}

function addToCart(id) {
  var product = allProducts.find(function(p) { return p._id === id; });
  if (!product || cart.some(function(c) { return c._id === id; })) return;
  cart.push(product);
  updateCartUI();
  filterAndRender(document.getElementById('search').value);
  showToast(product.name + ' added');
  var badge = document.getElementById('badge');
  badge.classList.remove('bump');
  void badge.offsetWidth;
  badge.classList.add('bump');
}

function removeFromCart(id) {
  cart = cart.filter(function(c) { return c._id !== id; });
  updateCartUI();
  filterAndRender(document.getElementById('search').value);
}

function updateCartUI() {
  var total = cart.reduce(function(s, p) { return s + p.price; }, 0);
  document.getElementById('badge').textContent = cart.length;
  document.getElementById('cart-total').textContent = '$' + total.toLocaleString();
  document.getElementById('cart-count-label').textContent = cart.length;

  var body = document.getElementById('cart-body');
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
init();