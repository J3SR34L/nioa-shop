const TOKEN_KEY = 'nioa_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function loginWithGoogle() {
  window.location.href = 'https://nioa-shop-production.up.railway.app/api/auth/google';
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('nioa_user');
  window.location.reload();
}

// Grab token from URL after OAuth redirect
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
if (token) {
  localStorage.setItem(TOKEN_KEY, token);
  window.history.replaceState({}, '', window.location.pathname);
}

// Fetch user info from backend
async function fetchUserInfo() {
  const t = getToken();
  if (!t) return null;
  try {
    const res = await fetch('https://nioa-shop-production.up.railway.app/api/auth/me', {
      headers: { 'Authorization': 'Bearer ' + t }
    });
    const user = await res.json();
    if (user.name) {
      localStorage.setItem('nioa_user', JSON.stringify(user));
      return user;
    }
  } catch(e) {}
  return null;
}

// Update nav login button
function updateAuthButton(user) {
  const btn = document.getElementById('login-btn');
  if (!btn) return;
  if (user && user.name) {
    btn.innerHTML = '<img src="' + user.avatar + '" style="width:22px;height:22px;border-radius:50%;margin-right:6px;vertical-align:middle" onerror="this.style.display=\'none\'"> ' + user.name.split(' ')[0];
    btn.style.borderColor = 'var(--cyan)';
    btn.style.color = 'var(--cyan)';
    btn.onclick = function() {
      if (confirm('Log out of NIOA?')) logout();
    };
  } else {
    btn.innerHTML = '⬡ Login';
    btn.onclick = loginWithGoogle;
  }
}

// Update sidebar user section
function updateSidebarUser(user) {
  var nameEl = document.getElementById('sidebar-user-name') || document.querySelector('.sidebar-user-name');
  var statusEl = document.querySelector('.sidebar-user-status');
  var avatarEl = document.querySelector('.sidebar-avatar');
  var authText = document.getElementById('sidebar-auth-text');
  var authBtn = document.getElementById('sidebar-auth-btn');

  if (user && user.name) {
    if (nameEl) nameEl.textContent = user.name;
    if (statusEl) statusEl.textContent = user.email;
    if (avatarEl) avatarEl.innerHTML = '<img src="' + user.avatar + '" style="width:100%;height:100%;border-radius:2px;object-fit:cover" onerror="this.outerHTML=\'👤\'">';
    if (authText) authText.textContent = 'Logout';
    if (authBtn) authBtn.onclick = function() { closeSidebar(); logout(); };
  } else {
    if (nameEl) nameEl.textContent = 'Guest User';
    if (statusEl) statusEl.textContent = 'Not logged in';
    if (avatarEl) avatarEl.innerHTML = '👤';
    if (authText) authText.textContent = 'Login';
    if (authBtn) authBtn.onclick = function() { closeSidebar(); loginWithGoogle(); };
  }
}

// Init auth
async function initAuth() {
  var cachedUser = null;
  try {
    cachedUser = JSON.parse(localStorage.getItem('nioa_user'));
  } catch(e) {}

  // Show cached user immediately
  if (cachedUser) {
    updateAuthButton(cachedUser);
    updateSidebarUser(cachedUser);
  }

  // Then fetch fresh data
  var user = await fetchUserInfo();
  updateAuthButton(user);
  updateSidebarUser(user);
}

// SIDEBAR
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('open');
  document.body.classList.add('sidebar-open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
  document.body.classList.remove('sidebar-open');
}

// SMOOTH PAGE NAVIGATION
function navigateTo(url) {
  document.body.classList.add('page-transition-out');
  setTimeout(function() {
    window.location.href = url;
  }, 380);
}

// Back button smooth transition
var backBtns = document.querySelectorAll('.back-btn');
backBtns.forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    navigateTo('index.html');
  });
});

document.addEventListener('DOMContentLoaded', initAuth);
window.addEventListener('load', initAuth);