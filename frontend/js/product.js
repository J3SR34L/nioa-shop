var productImages = {
  'Neural Visor X9':       'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&h=800&fit=crop&q=80',
  'Quantum Earbuds':       'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop&q=80',
  'HoloWatch Pro':         'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&q=80',
  'BioSync Band':          'https://images.unsplash.com/photo-1575827239239109-8a85d602b15b?w=800&h=800&fit=crop&q=80',
  'Plasma Speaker':        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop&q=80',
  'DronePad Mini':         'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=800&fit=crop&q=80',
  'Smart Jacket AI':       'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop&q=80',
  'Holo Projector':        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=800&fit=crop&q=80',
  'NanoBot Cleaner':       'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=800&fit=crop&q=80',
  'AR Glasses Lite':       'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&h=800&fit=crop&q=80',
  'Alienware m18 R2':      'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/alienware-notebooks/alienware-m18-mlk/spi/ng/notebook-alienware-m18-r2-nt-black-relsize-500-ng.psd?fmt=jpg&wid=500&hei=279',
  'Alienware x16 R2':      'https://www.dell.com/wp-uploads/2024/02/2-3.jpg',
  'Alienware m16 R2':      'https://cdn.mos.cms.futurecdn.net/ht4C4qRVGg5NnwQm3WLsrK.jpg',
  'Alienware x14 R2':      'https://sm.ign.com/ign_ap/deal/s/save-700-o/save-700-off-the-alienware-x14-r2-dells-thinnest-and-lightes_tcca.jpg',
  'Alienware Area-51m R2': 'https://i.ytimg.com/vi/BY2WIwKcaCQ/maxresdefault.jpg'
};

var currentProduct;

async function loadProduct() {
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id');
  if (!id) { window.location.href = 'index.html'; return; }

  try {
    var res = await fetch('https://nioa-shop-production.up.railway.app/api/products/' + id);
    var p = await res.json();
    renderProduct(p);
    document.title = 'NIOA — ' + p.name;
  } catch(e) {
    document.getElementById('detail-grid').innerHTML =
      '<div style="grid-column:1/-1;text-align:center;padding:5rem;color:var(--muted)">Product not found</div>';
  }
}

function renderProduct(p) {
  currentProduct = p;
  var stars = '★'.repeat(p.stars || 4) + '☆'.repeat(5 - (p.stars || 4));
  var imgUrl = productImages[p.name];
  var imgHTML = imgUrl
    ? '<img src="' + imgUrl + '" class="detail-real-img" alt="' + p.name + '" onerror="this.style.display=\'none\'">'
    : '<div style="font-size:120px">' + (p.emoji || '📦') + '</div>';

  var badge = p.badge === 'new'
    ? '<span class="detail-badge badge-new">New</span>'
    : p.badge === 'sale'
    ? '<span class="detail-badge badge-sale">Sale</span>'
    : '';

  var specsHTML = p.specs && p.specs.length
    ? p.specs.map(function(s) { return '<div class="spec-item">' + s + '</div>'; }).join('')
    : '';

  document.getElementById('detail-grid').innerHTML =
    '<div class="detail-img">' +
      badge +
      '<div class="detail-img-glow"></div>' +
      imgHTML +
    '</div>' +
    '<div class="detail-info">' +
      '<div class="detail-category">' + p.category + '</div>' +
      '<div class="detail-name">' + p.name + '</div>' +
      '<div class="detail-stars">' + stars + '</div>' +
      '<div class="detail-price">' +
        '<span class="detail-price-now">$' + p.price + '</span>' +
        (p.oldPrice ? '<span class="detail-price-was">$' + p.oldPrice + '</span>' : '') +
      '</div>' +
      '<div class="detail-desc">' + (p.description || '') + '</div>' +
      (specsHTML ? '<div class="detail-specs"><div class="specs-title">Specifications</div>' + specsHTML + '</div>' : '') +
      '<button class="detail-buy-btn" onclick="addToCartAndOpen(\'' + p._id + '\')">Add to Cart</button>' +
      '<button class="detail-wishlist-btn">♡ Add to Wishlist</button>' +
    '</div>';
}

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

loadProduct();