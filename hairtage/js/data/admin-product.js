const STORAGE_KEY = "adminProducts";
let adminProducts = JSON.parse(localStorage.getItem(STORAGE_KEY)) || products;

const params = new URLSearchParams(window.location.search);
const idParam = params.get("id");
const isEdit = idParam !== null;
const id = isEdit ? Number(idParam) : null;

const pageTitle = document.getElementById("pageTitle");
const previewImg = document.getElementById("previewImg");
const fileInput = document.getElementById("fileInput");

const nameInput = document.getElementById("nameInput");
const typeInput = document.getElementById("typeInput");
const priceInput = document.getElementById("priceInput");
const ingInput = document.getElementById("ingInput");
const descInput = document.getElementById("descInput");

const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const warning = document.getElementById("warning");

function saveAll() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(adminProducts));
}

function resolveImgForPreview(product) {
  if (product?.pic_data && String(product.pic_data).startsWith("data:")) return product.pic_data;
  if (product?.pic_url) return `assets/images/${product.pic_url}`;
  return "";
}

let product = null;

if (isEdit) {
  product = adminProducts.find(p => p.id === id);
  if (!product) {
    alert("Продукт не найден");
    window.location.href = "admin-products.html";
  }
  pageTitle.textContent = "Изменить продукт";
} else {
  pageTitle.textContent = "Добавить продукт";
  product = {
    id: Date.now(),
    name: "",
    type_product_name: "",
    pic_url: "shampoo_1.png", // fallback, если картинку не загрузили
    pic_data: "",             // сюда положим dataURL из файла
    price_category: "medium",
    ingridients_list: [],
    description: ""
  };
}

/* --- заполнение формы --- */
function hydrate() {
  previewImg.src = resolveImgForPreview(product) || "";
  nameInput.value = product.name || "";
  typeInput.value = product.type_product_name || "";
  priceInput.value = (product.price_category || "medium").toLowerCase();
  ingInput.value = (product.ingridients_list || []).join(", ");
  descInput.value = product.description || "";
}

hydrate();

/* --- загрузка картинки с устройства --- */
fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    product.pic_data = String(reader.result || "");
    previewImg.src = product.pic_data;
  };
  reader.readAsDataURL(file);
});

/* --- кнопки --- */
cancelBtn.addEventListener("click", () => {
  window.location.href = "admin-products.html";
});

saveBtn.addEventListener("click", () => {
  warning.style.display = "none";

  const name = nameInput.value.trim();
  const type = typeInput.value.trim();
  const price = priceInput.value;

  if (!name || !type) {
    warning.style.display = "block";
    return;
  }

  product.name = name;
  product.type_product_name = type;
  product.price_category = price;

  product.ingridients_list = ingInput.value
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  product.description = descInput.value.trim();

  if (isEdit) {
    const idx = adminProducts.findIndex(p => p.id === product.id);
    adminProducts[idx] = product;
  } else {
    adminProducts.unshift(product);
  }

  saveAll();
  window.location.href = "admin-products.html";
});