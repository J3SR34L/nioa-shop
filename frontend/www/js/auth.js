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