async function fetchProducts() {
  const res = await fetch('http://localhost:5000/api/products');
  return res.json();
}

async function placeOrder(items, total) {
  const res = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getToken()
    },
    body: JSON.stringify({ items, total })
  });
  return res.json();
}