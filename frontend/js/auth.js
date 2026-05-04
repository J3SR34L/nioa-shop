const TOKEN_KEY = 'nioa_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function loginWithGoogle() {
  window.location.href = 'http://localhost:5000/api/auth/google';
}

function logout() {
  localStorage.removeItem(TOKEN_KEY);
  window.location.reload();
}

const params = new URLSearchParams(window.location.search);
const token = params.get('token');
if (token) {
  localStorage.setItem(TOKEN_KEY, token);
  window.history.replaceState({}, '', '/frontend/index.html');
}