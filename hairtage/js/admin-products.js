const STORAGE_KEY = "adminProducts";

// берём из localStorage, иначе дефолт из products.js
let adminProducts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || products;

const container = document.getElementById("categoriesContainer");
const searchInput = document.getElementById("searchInput");

const addBtn = document.getElementById("addBtn");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");

let selectedId = null;

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(adminProducts));
}

function resolveImgSrc(p) {
  if (p.pic_data && String(p.pic_data).startsWith("data:")) return p.pic_data;
  return `assets/images/${p.pic_url}`;
}

function groupByCategory(items) {
  return items.reduce((acc, p) => {
    const key = p.type_product_name || "Без категории";
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});
}

function applySearch(items) {
  const q = (searchInput.value || "").trim().toLowerCase();
  if (!q) return items;

  return items.filter(p => {
    const name = (p.name || "").toLowerCase();
    const cat = (p.type_product_name || "").toLowerCase();
    const price = (p.price_category || "").toLowerCase();
    const ing = (p.ingridients_list || []).join(", ").toLowerCase();
    return name.includes(q) || cat.includes(q) || price.includes(q) || ing.includes(q);
  });
}

function setSelected(id) {
  selectedId = id;
  editBtn.disabled = !selectedId;
  deleteBtn.disabled = !selectedId;

  document.querySelectorAll(".product-card").forEach(el => {
    const elId = Number(el.dataset.id);
    el.classList.toggle("selected", elId === selectedId);
  });
}

function render() {
  container.innerHTML = "";
  selectedId = null;
  editBtn.disabled = true;
  deleteBtn.disabled = true;

  const filtered = applySearch(adminProducts);
  const grouped = groupByCategory(filtered);

  const categories = Object.keys(grouped);
  if (categories.length === 0) {
    container.innerHTML = `<p style="font-size: 20px; color: rgba(46,46,46,0.6);">Ничего не найдено</p>`;
    return;
  }

  categories.forEach(catName => {
    const section = document.createElement("section");
    section.className = "category";

    section.innerHTML = `
      <p class="category-title">${catName}</p>
      <div class="products-grid">
        ${grouped[catName].map(p => `
          <div class="product-card" data-id="${p.id}">
            <img src="${resolveImgSrc(p)}" alt="${p.name}">
            <div class="product-info">
              <p>${p.name}</p>
              <div class="price">${String(p.price_category || "").toLowerCase()}</div>
            </div>
          </div>
        `).join("")}
      </div>
    `;

    container.appendChild(section);
  });

  document.querySelectorAll(".product-card").forEach(el => {
    el.addEventListener("click", () => setSelected(Number(el.dataset.id)));
  });
}

/* actions */
addBtn.addEventListener("click", () => {
  window.location.href = "admin-product.html";
});

editBtn.addEventListener("click", () => {
  if (!selectedId) return;
  window.location.href = `admin-product.html?id=${selectedId}`;
});

deleteBtn.addEventListener("click", () => {
  if (!selectedId) return;
  if (!confirm("Удалить продукт?")) return;

  adminProducts = adminProducts.filter(p => p.id !== selectedId);
  save();
  render();
});

searchInput.addEventListener("input", render);

render();