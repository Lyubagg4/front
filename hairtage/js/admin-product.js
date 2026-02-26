const STORAGE_KEY = "adminProducts";
let adminProducts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || products;

const params = new URLSearchParams(window.location.search);
const idParam = params.get("id");
const isEdit = idParam !== null;
const id = isEdit ? Number(idParam) : null;

const imgBox = document.getElementById("imgBox");
const previewImg = document.getElementById("previewImg");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");

const nameInput = document.getElementById("nameInput");
const typeInput = document.getElementById("typeInput");
const priceInput = document.getElementById("priceInput");
const ingInput = document.getElementById("ingInput");

const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const warn = document.getElementById("warn");

function saveAll() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(adminProducts));
}

let product;

if (isEdit) {
  product = adminProducts.find(p => p.id === id);
  if (!product) {
    alert("Продукт не найден");
    window.location.href = "admin-products.html";
  }
  document.title = "Админ — Редактирование";
} else {
  product = {
    id: Date.now(),
    name: "",
    type_product_name: "",
    pic_url: "shampoo_1.png",
    pic_data: "",
    price_category: "medium",
    ingridients_list: []
  };
  document.title = "Админ — Добавление";
}

function resolveImg(p) {
  if (p.pic_data && String(p.pic_data).startsWith("data:")) return p.pic_data;
  if (p.pic_url) return `assets/images/${p.pic_url}`;
  return "";
}

function hydrate() {
  const src = resolveImg(product);
  previewImg.src = src || "";
  nameInput.value = product.name || "";
  typeInput.value = product.type_product_name || "";
  priceInput.value = (product.price_category || "").toLowerCase();
  ingInput.value = (product.ingridients_list || []).join(", ");
}

hydrate();

/* Изменить изображение — под фото */
uploadBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    // dataURL сохраняем в объект
    product.pic_data = String(reader.result || "");
    previewImg.src = product.pic_data; // сразу подставляем
  };
  reader.readAsDataURL(file);
});

cancelBtn.addEventListener("click", () => {
  window.location.href = "admin-products.html";
});

saveBtn.addEventListener("click", () => {
  warn.style.display = "none";

  const name = nameInput.value.trim();
  const type = typeInput.value.trim();

  if (!name || !type) {
    warn.style.display = "block";
    return;
  }

  // допускаем любой текст в ценовой категории, как на макете
  const price = (priceInput.value || "").trim();

  product.name = name;
  product.type_product_name = type;
  product.price_category = price;

  product.ingridients_list = ingInput.value
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  if (isEdit) {
    const idx = adminProducts.findIndex(p => p.id === product.id);
    adminProducts[idx] = product;
  } else {
    adminProducts.unshift(product);
  }

  saveAll();
  window.location.href = "admin-products.html";
});