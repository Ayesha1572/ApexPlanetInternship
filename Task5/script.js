/* =========================
   BookNest – Online Bookstore
   Features: search, category filters, details modal, cart with qty, localStorage persistence,
             lazy-loaded images, responsive UI, minimal HTTP requests.
   ========================= */

// --- Demo data (could be swapped with a JSON fetch) ---
const BOOKS = [
  { id: 1, title: "The Silent Library", author: "Mira Collins", price: 399, category: "Fiction",
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop",
    desc: "A literary mystery that unfolds across decades inside a city library." },
  { id: 2, title: "Atomic Habits", author: "James Clear", price: 499, category: "Self-Help",
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400&auto=format&fit=crop",
    desc: "Tiny changes, remarkable results. A practical guide to building better habits." },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", price: 899, category: "Technology",
    img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=400&auto=format&fit=crop",
    desc: "A handbook of agile software craftsmanship for writing maintainable code." },
  { id: 4, title: "Deep Work", author: "Cal Newport", price: 449, category: "Business",
    img: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=400&auto=format&fit=crop",
    desc: "Rules for focused success in a distracted world." },
  { id: 5, title: "Brief Answers to the Big Questions", author: "Stephen Hawking", price: 599, category: "Science",
    img: "https://images.unsplash.com/photo-1470167290877-7d5d3446de4c?q=80&w=400&auto=format&fit=crop",
    desc: "Hawking’s final thoughts on the universe’s biggest mysteries." },
  { id: 6, title: "The Pragmatic Programmer", author: "Andrew Hunt, David Thomas", price: 829, category: "Technology",
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=400&auto=format&fit=crop",
    desc: "Journey to mastery with timeless tips for modern software development." },
  { id: 7, title: "Project Hail Mary", author: "Andy Weir", price: 699, category: "Fiction",
    img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=400&auto=format&fit=crop",
    desc: "A lone astronaut, an impossible mission, and a surprising ally." },
  { id: 8, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", price: 549, category: "Business",
    img: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=400&auto=format&fit=crop",
    desc: "A tour of the mind’s two systems that drive the way we think." },
  { id: 9, title: "Astrophysics for People in a Hurry", author: "Neil deGrasse Tyson", price: 429, category: "Science",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop",
    desc: "The cosmos, served neat—quick and digestible astrophysics." },
  { id: 10, title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", price: 999, category: "Technology",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400&auto=format&fit=crop",
    desc: "The big ideas behind reliable, scalable, and maintainable systems." }
];

// --- State ---
let state = {
  query: "",
  category: "All",
  cart: loadCart()
};

// --- Elements ---
const grid = document.getElementById("grid");
const emptyState = document.getElementById("emptyState");
const chips = [...document.querySelectorAll(".chip")];
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const detailsModal = document.getElementById("detailsModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalAuthor = document.getElementById("modalAuthor");
const modalDesc = document.getElementById("modalDesc");
const modalPrice = document.getElementById("modalPrice");
const modalAddBtn = document.getElementById("modalAddBtn");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

// --- Init ---
document.getElementById("year").textContent = new Date().getFullYear();
renderBooks();
renderCart();

// --- Listeners ---
searchInput.addEventListener("input", (e)=>{ state.query = e.target.value.trim(); renderBooks(); });
clearSearch.addEventListener("click", ()=>{ searchInput.value=""; state.query=""; renderBooks(); searchInput.focus(); });

chips.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    chips.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    state.category = btn.dataset.cat;
    renderBooks();
  });
});

document.body.addEventListener("click", (e)=>{
  const card = e.target.closest("[data-book-id]");
  if(card && e.target.matches(".view-btn")) openDetails(+card.dataset.bookId);
  if(card && e.target.matches(".add-btn")) addToCart(+card.dataset.bookId);
});

document.querySelectorAll("[data-close-modal]").forEach(b=>{
  b.addEventListener("click", ()=> detailsModal.close());
});

openCartBtn.addEventListener("click", ()=>{
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden","false");
  openCartBtn.setAttribute("aria-expanded","true");
});
document.getElementById("closeCartBtn").addEventListener("click", closeCart);
function closeCart(){
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden","true");
  openCartBtn.setAttribute("aria-expanded","false");
}
document.getElementById("checkoutBtn").addEventListener("click", ()=>{
  if(!state.cart.length){ alert("Your cart is empty."); return; }
  alert("Demo checkout – implement payment here.");
});

// Close on ESC
addEventListener("keydown", (e)=>{ if(e.key==="Escape"){ detailsModal.open && detailsModal.close(); if(cartDrawer.classList.contains("open")) closeCart(); }});

// --- Renderers ---
function renderBooks(){
  const q = state.query.toLowerCase();
  const filtered = BOOKS.filter(b=>{
    const qMatch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    const cMatch = state.category==="All" || b.category===state.category;
    return qMatch && cMatch;
  });

  grid.innerHTML = filtered.map(b=> cardHTML(b)).join("");
  emptyState.hidden = filtered.length>0;
}

function cardHTML(b){
  return `
  <article class="card" data-book-id="${b.id}">
    <div class="media">
      <img src="${b.img}" alt="Cover of ${escapeHTML(b.title)}" loading="lazy" width="300" height="400">
    </div>
    <div class="body">
      <div class="title">${escapeHTML(b.title)}</div>
      <p class="author">${escapeHTML(b.author)}</p>
      <div class="row">
        <span class="price">₹${b.price.toFixed(2)}</span>
        <div class="row" style="gap:8px">
          <button class="btn view-btn">Details</button>
          <button class="btn primary add-btn">Add</button>
        </div>
      </div>
    </div>
  </article>`;
}

function openDetails(id){
  const b = BOOKS.find(x=>x.id===id);
  if(!b) return;
  detailsModal.returnValue = "";
  modalImg.src = b.img;
  modalImg.alt = `Cover of ${b.title}`;
  modalTitle.textContent = b.title;
  modalAuthor.textContent = b.author + " • " + b.category;
  modalDesc.textContent = b.desc;
  modalPrice.textContent = `₹${b.price.toFixed(2)}`;
  modalAddBtn.onclick = ()=>{ addToCart(b.id); detailsModal.close(); };
  detailsModal.showModal();
}

// --- Cart ---
function addToCart(id){
  const idx = state.cart.findIndex(i=>i.id===id);
  if(idx>-1) state.cart[idx].qty += 1;
  else state.cart.push({id, qty:1});
  saveCart(); renderCart();
}

function changeQty(id, qty){
  const item = state.cart.find(i=>i.id===id);
  if(!item) return;
  item.qty = Math.max(1, qty|0);
  saveCart(); renderCart();
}

function removeFromCart(id){
  state.cart = state.cart.filter(i=>i.id!==id);
  saveCart(); renderCart();
}

function renderCart(){
  if(!state.cart.length){
    cartItems.innerHTML = `<p class="muted center">Your cart is empty.</p>`;
    cartTotal.textContent = "₹0.00";
    cartCount.textContent = "0";
    return;
  }
  const rows = state.cart.map(({id, qty})=>{
    const b = BOOKS.find(x=>x.id===id);
    const line = b.price * qty;
    return `
      <div class="cart-item">
        <img src="${b.img}" alt="" width="64" height="86" loading="lazy">
        <div>
          <div class="title">${escapeHTML(b.title)}</div>
          <div class="muted">${escapeHTML(b.author)}</div>
          <div class="muted">₹${b.price.toFixed(2)}</div>
        </div>
        <div class="qty">
          <input type="number" min="1" value="${qty}" aria-label="Quantity for ${escapeHTML(b.title)}" data-qty="${b.id}">
          <strong>₹${line.toFixed(2)}</strong>
          <button class="icon-btn remove" data-remove="${b.id}">Remove</button>
        </div>
      </div>`;
  }).join("");
  cartItems.innerHTML = rows;

  // Bind qty & remove
  cartItems.querySelectorAll("[data-qty]").forEach(inp=>{
    inp.addEventListener("change", e=> changeQty(+inp.dataset.qty, +e.target.value));
  });
  cartItems.querySelectorAll("[data-remove]").forEach(btn=>{
    btn.addEventListener("click", ()=> removeFromCart(+btn.dataset.remove));
  });

  const total = state.cart.reduce((sum, {id, qty})=>{
    const b = BOOKS.find(x=>x.id===id);
    return sum + b.price * qty;
  },0);
  cartTotal.textContent = `₹${total.toFixed(2)}`;
  cartCount.textContent = String(state.cart.reduce((s,i)=>s+i.qty,0));
}

// --- Persistence ---
function loadCart(){
  try{ return JSON.parse(localStorage.getItem("booknest_cart")||"[]"); }catch{ return []; }
}
function saveCart(){ localStorage.setItem("booknest_cart", JSON.stringify(state.cart)); }

// --- Utils ---
function escapeHTML(s){ return s.replace(/[&<>"']/g, m=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m])); }

