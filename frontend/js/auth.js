var TOKEN_KEY = 'nioa_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function loginWithGoogle() {
  window.location.href = 'https://nioa-shop-production.up.railway.app/api/auth/google';
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('nioa_user');
  sessionStorage.removeItem('nioa_just_logged_in');
  window.location.reload();
}

// Grab token from URL after OAuth redirect
var urlParams = new URLSearchParams(window.location.search);
var urlToken = urlParams.get('token');
if (urlToken) {
  localStorage.setItem(TOKEN_KEY, urlToken);
  sessionStorage.removeItem('nioa_just_logged_in');
  window.history.replaceState({}, '', window.location.pathname);
}

// Fetch user info from backend
function fetchUserInfo() {
  var t = getToken();
  if (!t) return Promise.resolve(null);
  return fetch('https://nioa-shop-production.up.railway.app/api/auth/me', {
    headers: { 'Authorization': 'Bearer ' + t }
  })
  .then(function(res) { return res.json(); })
  .then(function(user) {
    if (user && user.name) {
      localStorage.setItem('nioa_user', JSON.stringify(user));
      return user;
    }
    return null;
  })
  .catch(function() { return null; });
}

// Update nav login button
function updateAuthButton(user) {
  var btn = document.getElementById('login-btn');
  if (!btn) return;
  if (user && user.name) {
    btn.innerHTML = '<img src="' + user.avatar + '" style="width:22px;height:22px;border-radius:50%;margin-right:6px;vertical-align:middle" onerror="this.style.display=\'none\'"> ' + user.name.split(' ')[0];
    btn.style.borderColor = 'var(--cyan)';
    btn.style.color = 'var(--cyan)';
    btn.onclick = function() {
      if (confirm('Log out of NIOA?')) logout();
    };
  } else {
    btn.innerHTML = '&#x2b21; Login';
    btn.onclick = loginWithGoogle;
  }
}

// Update sidebar user section
function updateSidebarUser(user) {
  var nameEl = document.querySelector('.sidebar-user-name');
  var statusEl = document.querySelector('.sidebar-user-status');
  var avatarEl = document.querySelector('.sidebar-avatar');
  var authText = document.getElementById('sidebar-auth-text');
  var authBtn = document.getElementById('sidebar-auth-btn');

  if (user && user.name) {
    if (nameEl) nameEl.textContent = user.name;
    if (statusEl) statusEl.textContent = user.email;
    if (avatarEl) avatarEl.innerHTML = '<img src="' + user.avatar + '" style="width:100%;height:100%;border-radius:2px;object-fit:cover" onerror="this.outerHTML=\'&#128100;\'">';
    if (authText) authText.textContent = 'Logout';
    if (authBtn) authBtn.onclick = function() { closeSidebar(); logout(); };
  } else {
    if (nameEl) nameEl.textContent = 'Guest User';
    if (statusEl) statusEl.textContent = 'Not logged in';
    if (avatarEl) avatarEl.innerHTML = '&#128100;';
    if (authText) authText.textContent = 'Login';
    if (authBtn) authBtn.onclick = function() { closeSidebar(); loginWithGoogle(); };
  }
}

// Welcome banner
function showWelcomeBanner(msg) {
  var banner = document.createElement('div');
  banner.style.cssText = 'position:fixed;top:80px;left:50%;transform:translateX(-50%) translateY(-20px);background:rgba(8,12,28,0.95);border:1px solid #4df0d8;color:#e2eeff;padding:14px 28px;font-family:Syne,sans-serif;font-size:15px;font-weight:600;letter-spacing:1px;z-index:999;backdrop-filter:blur(12px);box-shadow:0 8px 40px rgba(77,240,216,0.2);opacity:0;transition:all 0.4s ease;white-space:nowrap;';
  banner.textContent = msg;
  document.body.appendChild(banner);
  setTimeout(function() {
    banner.style.opacity = '1';
    banner.style.transform = 'translateX(-50%) translateY(0)';
  }, 100);
  setTimeout(function() {
    banner.style.opacity = '0';
    banner.style.transform = 'translateX(-50%) translateY(-20px)';
    setTimeout(function() { banner.remove(); }, 400);
  }, 4000);
}

// Init auth
function initAuth() {
  var cachedUser = null;
  try {
    cachedUser = JSON.parse(localStorage.getItem('nioa_user'));
  } catch(e) {}

  if (cachedUser) {
    updateAuthButton(cachedUser);
    updateSidebarUser(cachedUser);
  }

  fetchUserInfo().then(function(user) {
    updateAuthButton(user);
    updateSidebarUser(user);

    var justLoggedIn = sessionStorage.getItem('nioa_just_logged_in');
    if (user && user.name && !justLoggedIn) {
      sessionStorage.setItem('nioa_just_logged_in', 'true');
      var hour = new Date().getHours();
      var greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
      var firstName = user.name.split(' ')[0];
      setTimeout(function() {
        showWelcomeBanner(greeting + ', ' + firstName + '! Welcome back to NIOA');
      }, 1000);
    }
  });
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

var backBtns = document.querySelectorAll('.back-btn');
backBtns.forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    navigateTo('index.html');
  });
});

document.addEventListener('DOMContentLoaded', initAuth);
window.addEventListener('load', initAuth);