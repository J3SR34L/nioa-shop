const API = 'https://nioa-shop-production.up.railway.app/api';
let products = [];
let editingId = null;

function showToast(msg, isError) {
  var t = document.getElementById('toast');
  t.textContent = '// ' + msg;
  t.style.borderColor = isError ? 'var(--pink)' : 'var(--cyan)';
  t.style.color = isError ? 'var(--pink)' : 'var(--cyan)';
  t.classList.add('show');
  setTimeout(function() { t.classList.remove('show'); }, 2500);
}

async function initAdmin() {
  if (!getToken()) return;

  var wrap = document.getElementById('admin-wrap');
  wrap.innerHTML = `
    <div class="admin-header">
      <div class="admin-title">Admin <span>Panel</span></div>
    </div>
    <div class="admin-stats">
      <div class="stat-card">
        <div class="stat-card-num" id="stat-products">—</div>
        <div class="stat-card-label">Products</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-num" id="stat-categories">—</div>
        <div class="stat-card-label">Categories</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-num" id="stat-sale">—</div>
        <div class="stat-card-label">On Sale</div>
      </div>
    </div>
    <div class="admin-grid">
      <div class="admin-card">
        <div class="admin-card-title" id="form-title">Add New Product</div>
        <div class="form-group">
          <label class="form-label">Product Name</label>
          <input class="form-input" id="f-name" placeholder="e.g. Neural Visor X9"/>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Price ($)</label>
            <input class="form-input" id="f-price" type="number" placeholder="899"/>
          </div>
          <div class="form-group">
            <label class="form-label">Old Price ($)</label>
            <input class="form-input" id="f-oldprice" type="number" placeholder="Optional"/>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Category</label>
            <select class="form-select" id="f-category">
              <option value="tech">Tech</option>
              <option value="audio">Audio</option>
              <option value="wear">Wear</option>
              <option value="home">Home</option>
              <option value="health">Health</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Badge</label>
            <select class="form-select" id="f-badge">
              <option value="">None</option>
              <option value="new">New</option>
              <option value="sale">Sale</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Emoji</label>
            <input class="form-input" id="f-emoji" placeholder="🔮"/>
          </div>
          <div class="form-group">
            <label class="form-label">Stars (1-5)</label>
            <input class="form-input" id="f-stars" type="number" min="1" max="5" placeholder="5"/>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-textarea" id="f-desc" placeholder="Product description..."></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Specs (one per line)</label>
          <textarea class="form-textarea" id="f-specs" placeholder="16K resolution&#10;Neural interface&#10;8hr battery"></textarea>
        </div>
        <button class="submit-btn" onclick="saveProduct()" id="save-btn">Add Product</button>
        <button class="clear-btn" onclick="clearForm()">Clear Form</button>
      </div>
      <div class="admin-card">
        <div class="admin-card-title">Products <span id="product-count" style="color:var(--muted);font-size:11px"></span></div>
        <div class="products-list" id="products-list">Loading...</div>
      </div>
    </div>
  `;

  await loadProducts();
}

async function loadProducts() {
  try {
    const res = await fetch(API + '/products');
    products = await res.json();

    document.getElementById('stat-products').textContent = products.length;
    document.getElementById('stat-categories').textContent = [...new Set(products.map(function(p) { return p.category; }))].length;
    document.getElementById('stat-sale').textContent = products.filter(function(p) { return p.badge === 'sale'; }).length;
    document.getElementById('product-count').textContent = '(' + products.length + ')';

    var list = document.getElementById('products-list');
    if (products.length === 0) {
      list.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--muted);font-size:13px">No products yet</div>';
      return;
    }

    list.innerHTML = products.map(function(p) {
      return '<div class="product-row">' +
        '<div class="pr-emoji">' + (p.emoji || '📦') + '</div>' +
        '<div class="pr-info">' +
          '<div class="pr-name">' + p.name + '</div>' +
          '<div class="pr-meta">$' + p.price + ' · ' + p.category + (p.badge ? ' · ' + p.badge : '') + '</div>' +
        '</div>' +
        '<div class="pr-actions">' +
          '<button class="pr-edit" onclick="editProduct(\'' + p._id + '\')">Edit</button>' +
          '<button class="pr-delete" onclick="deleteProduct(\'' + p._id + '\')">Delete</button>' +
        '</div>' +
      '</div>';
    }).join('');
  } catch(e) {
    showToast('Failed to load products', true);
  }
}

async function saveProduct() {
  var name = document.getElementById('f-name').value.trim();
  var price = document.getElementById('f-price').value;
  if (!name || !price) return showToast('Name and price required', true);

  var specs = document.getElementById('f-specs').value
    .split('\n').map(function(s) { return s.trim(); }).filter(Boolean);

  var data = {
    name: name,
    price: Number(price),
    oldPrice: document.getElementById('f-oldprice').value ? Number(document.getElementById('f-oldprice').value) : null,
    category: document.getElementById('f-category').value,
    badge: document.getElementById('f-badge').value,
    emoji: document.getElementById('f-emoji').value || '📦',
    stars: Number(document.getElementById('f-stars').value) || 5,
    description: document.getElementById('f-desc').value.trim(),
    specs: specs
  };

  try {
    var url = editingId ? API + '/products/' + editingId : API + '/products';
    var method = editingId ? 'PUT' : 'POST';
    await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
      },
      body: JSON.stringify(data)
    });
    showToast(editingId ? 'Product updated!' : 'Product added!');
    clearForm();
    await loadProducts();
  } catch(e) {
    showToast('Failed to save product', true);
  }
}

function editProduct(id) {
  var p = products.find(function(x) { return x._id === id; });
  if (!p) return;
  editingId = id;
  document.getElementById('form-title').textContent = 'Edit Product';
  document.getElementById('save-btn').textContent = 'Update Product';
  document.getElementById('f-name').value = p.name || '';
  document.getElementById('f-price').value = p.price || '';
  document.getElementById('f-oldprice').value = p.oldPrice || '';
  document.getElementById('f-category').value = p.category || 'tech';
  document.getElementById('f-badge').value = p.badge || '';
  document.getElementById('f-emoji').value = p.emoji || '';
  document.getElementById('f-stars').value = p.stars || 5;
  document.getElementById('f-desc').value = p.description || '';
  document.getElementById('f-specs').value = (p.specs || []).join('\n');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  try {
    await fetch(API + '/products/' + id, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + getToken() }
    });
    showToast('Product deleted!');
    await loadProducts();
  } catch(e) {
    showToast('Failed to delete', true);
  }
}

function clearForm() {
  editingId = null;
  document.getElementById('form-title').textContent = 'Add New Product';
  document.getElementById('save-btn').textContent = 'Add Product';
  ['f-name','f-price','f-oldprice','f-emoji','f-desc','f-specs'].forEach(function(id) {
    document.getElementById(id).value = '';
  });
  document.getElementById('f-category').value = 'tech';
  document.getElementById('f-badge').value = '';
  document.getElementById('f-stars').value = '';
}

document.addEventListener('DOMContentLoaded', function() {
  if (getToken()) initAdmin();
});
window.addEventListener('load', function() {
  if (getToken()) initAdmin();
});