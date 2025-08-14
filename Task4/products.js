// products.js - sample products with filtering & sorting
const products = [
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 1999, rating: 4.5, desc: 'Bluetooth over-ear',img:'headphones.jpg'},
  { id: 2, name: 'Espresso Mug', category: 'Home', price: 299, rating: 4.0, desc: 'Ceramic 300ml',img:'expressomug.png'},
  { id: 3, name: 'Running Shoes', category: 'Fashion', price: 2499, rating: 4.6, desc: 'Lightweight',img:'runningshoes.jpg'},
  { id: 4, name: 'USB-C Cable', category: 'Electronics', price: 199, rating: 4.2, desc: '1.5m durable',img:'usbcable.jpg'},
  { id: 5, name: 'Desk Lamp', category: 'Home', price: 899, rating: 4.1, desc: 'LED adjustable',img:'lamp.jpg'},
  { id: 6, name: 'T-Shirt', category: 'Fashion', price: 599, rating: 4.3, desc: '100% cotton',img:'Tshirt.jpg'},
];

const grid = document.getElementById('products-grid');
const catFilter = document.getElementById('category-filter');
const sortBy = document.getElementById('sort-by');
const search = document.getElementById('search');

function populateCategories() {
  const cats = Array.from(new Set(products.map(p => p.category)));
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    catFilter.appendChild(opt);
  });
}

function renderList() {
  let list = products.slice();
  const cat = catFilter.value;
  const q = search.value.trim().toLowerCase();

  // Filter by category
  if (cat && cat !== 'all') {
    list = list.filter(p => p.category === cat);
  }

  // Filter by search text
  if (q) {
    list = list.filter(p =>
      (p.name + ' ' + p.desc).toLowerCase().includes(q)
    );
  }

  // Sorting
  const sort = sortBy.value;
  if (sort === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating-desc') {
    list.sort((a, b) => b.rating - a.rating);
  }

  // Render products
  grid.innerHTML = '';
  if (list.length === 0) {
    grid.textContent = 'No products found.';
    return;
  }

  list.forEach(p => {
    const el = document.createElement('div');
    el.className = 'product';
    el.innerHTML = `
      <img src="${p.img}" alt="${p.name}" style="max-width:100%; border-radius:8px;">
      <h4>${p.name}</h4>
      <p class="muted">${p.category} • ₹${p.price} • ⭐ ${p.rating}</p>
      <p>${p.desc}</p>
      <button class="btn">Add to cart</button>
    `;
    grid.appendChild(el);
  });
}

catFilter.addEventListener('change', renderList);
sortBy.addEventListener('change', renderList);
search.addEventListener('input', () => {
  setTimeout(renderList, 150); // debounce search
});

populateCategories();
renderList();
