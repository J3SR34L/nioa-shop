async function fetchProducts() {
  const res = await fetch('https://nioa-shop-production.up.railway.app/api/products');
  return res.json();
}

async function placeOrder(items, total) {
  const res = await fetch('https://nioa-shop-production.up.railway.app/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getToken()
    },
    body: JSON.stringify({ items, total })
  });
  return res.json();
}