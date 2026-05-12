const TOKEN_KEY = 'nioa_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function loginWithGoogle() {
  window.location.href = 'https://nioa-shop-production.up.railway.app/api/auth/google';
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  window.location.reload();
}

const params = new URLSearchParams(window.location.search);
const token = params.get('token');
if (token) {
  localStorage.setItem(TOKEN_KEY, token);
  window.history.replaceState({}, '', window.location.pathname);
}

function updateAuthButton() {
  const btn = document.getElementById('login-btn');
  if (!btn) return;
  if (getToken()) {
    btn.textContent = '⬡ Logged In';
    btn.style.borderColor = 'var(--cyan)';
    btn.style.color = 'var(--cyan)';
    btn.onclick = function() {
      if (confirm('Log out of NIOA?')) logout();
    };
  } else {
    btn.textContent = '⬡ Login';
    btn.onclick = loginWithGoogle;
  }
}

document.addEventListener('DOMContentLoaded', updateAuthButton);
window.addEventListener('load', updateAuthButton);
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
// SIDEBAR
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('open');

  // Update auth button in sidebar
  var authBtn = document.getElementById('sidebar-auth-btn');
  var authText = document.getElementById('sidebar-auth-text');
  if (getToken()) {
    if (authText) authText.textContent = 'Logout';
    if (authBtn) authBtn.onclick = function() { closeSidebar(); logout(); };
  } else {
    if (authText) authText.textContent = 'Login';
    if (authBtn) authBtn.onclick = function() { closeSidebar(); loginWithGoogle(); };
  }
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}