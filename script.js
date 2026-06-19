// Simple product data used on multiple pages
const PRODUCTS = [
  {
    id: "p1",
    name: "Minimalist Watch",
    price: 79.0,
    image:
      "assets/pexels-pixabay-364822.jpg",
    description:
      "A clean, modern watch with a simple face and comfortable strap. Ideal for everyday wear.",
    featured: true,
  },
  {
    id: "p2",
    name: "Classic Backpack",
    price: 59.0,
    image:
      "assets/pexels-bertellifotografia-2905238.jpg",
    description:
      "Lightweight backpack with a dedicated laptop compartment and space for daily essentials.",
    featured: true,
  },
  {
    id: "p3",
    name: "Noise-Cancelling Headphones",
    price: 129.0,
    image:
      "https://images.pexels.com/photos/3394664/pexels-photo-3394664.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Over-ear headphones that reduce background noise to help you focus on your work or music.",
    featured: true,
  },
  {
    id: "p4",
    name: "Reusable Bottle",
    price: 25.0,
    image:
      "assets/pexels-mart-production-8217303.jpg",
    description:
      "Insulated stainless-steel bottle that keeps drinks cold or hot for several hours.",
  },
  {
    id: "p5",
    name: "Desk Lamp",
    price: 39.0,
    image:
      "assets/pexels-timotej-284951.jpg",
    description:
      "Adjustable LED desk lamp with warm and cool light settings to reduce eye strain.",
  },
  {
    id: "p6",
    name: "Notebook Set",
    price: 19.0,
    image:
      "assets/pexels-abhilashsahoo-4295845.jpg",
    description:
      "Pack of three minimalist notebooks with dotted pages, perfect for planning and sketching.",
  },
];

// --- Local storage helpers ---
function getCart() {
  const raw = localStorage.getItem("simpleShopCart");
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("simpleShopCart", JSON.stringify(cart));
}

function getCartCount(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartCount() {
  const cart = getCart();
  const count = getCartCount(cart);
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.textContent = count;
  }
}

// --- Feedback helper ---
function showFeedback(message, type = "success") {
  const box = document.getElementById("feedback");
  if (!box) return;
  box.textContent = message;
  box.className = `alert alert-${type}`;
  box.classList.remove("d-none");
  box.style.opacity = "1";
  box.style.transform = "translateY(0)";

  // Hide after a few seconds for non-error messages
  if (type !== "danger") {
    setTimeout(() => {
      box.style.opacity = "0";
      box.style.transform = "translateY(-4px)";
      setTimeout(() => {
        box.classList.add("d-none");
      }, 200);
    }, 2500);
  }
}

// --- Product lookup ---
function findProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

// --- Add to cart ---
function addToCart(productId, quantity = 1) {
  const product = findProductById(productId);
  if (!product) {
    showFeedback("This product could not be found.", "danger");
    return;
  }

  const qty = Number(quantity) || 1;
  if (qty < 1) {
    showFeedback("Please select a quantity of at least 1.", "danger");
    return;
  }

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ id: productId, quantity: qty });
  }
  saveCart(cart);
  updateCartCount();
  showFeedback(`“${product.name}” was added to your cart.`, "success");
}

// --- Render helpers ---
function renderFeaturedProducts() {
  const container = document.getElementById("featured-products");
  if (!container) return;
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 3);
  container.innerHTML = "";

  featured.forEach((product) => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-4";
    col.innerHTML = `
      <div class="card h-100 shadow-sm product-card">
        <img src="${product.image}" class="card-img-top" alt="${product.name}" />
        <div class="card-body d-flex flex-column">
          <h3 class="h6 card-title mb-1">${product.name}</h3>
          <p class="card-text text-muted small flex-grow-1">
            ${product.description.substring(0, 80)}...
          </p>
          <p class="fw-semibold mb-2">$${product.price.toFixed(2)}</p>
          <div class="d-flex gap-2">
            <a href="product-details.html?id=${product.id}" class="btn btn-outline-secondary btn-sm flex-grow-1">
              View Details
            </a>
            <button
              type="button"
              class="btn btn-primary btn-sm flex-grow-1"
              data-add-to-cart="${product.id}"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

function renderProductGrid() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  grid.innerHTML = "";

  PRODUCTS.forEach((product) => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4";
    col.innerHTML = `
      <div class="card h-100 shadow-sm product-card">
        <img src="${product.image}" class="card-img-top" alt="${product.name}" />
        <div class="card-body d-flex flex-column">
          <h3 class="h6 card-title mb-1">${product.name}</h3>
          <p class="card-text text-muted small flex-grow-1">
            ${product.description.substring(0, 80)}...
          </p>
          <p class="fw-semibold mb-2">$${product.price.toFixed(2)}</p>
          <div class="d-flex gap-2">
            <a href="product-details.html?id=${product.id}" class="btn btn-outline-secondary btn-sm flex-grow-1">
              View Details
            </a>
            <button
              type="button"
              class="btn btn-primary btn-sm flex-grow-1"
              data-add-to-cart="${product.id}"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}

function renderProductDetail() {
  const container = document.getElementById("product-detail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = id ? findProductById(id) : null;

  const notFound = document.getElementById("product-not-found");
  if (!product) {
    if (notFound) notFound.classList.remove("d-none");
    container.classList.add("d-none");
    return;
  }

  if (notFound) notFound.classList.add("d-none");
  container.classList.remove("d-none");

  container.innerHTML = `
    <div class="col-12 col-md-6">
      <img src="${product.image}" class="img-fluid rounded border" alt="${product.name}" />
    </div>
    <div class="col-12 col-md-6">
      <h1 class="h4 mb-2">${product.name}</h1>
      <p class="text-muted mb-3">${product.description}</p>
      <p class="h5 fw-semibold mb-4">$${product.price.toFixed(2)}</p>

      <form id="detail-form" class="row g-3">
        <div class="col-6 col-sm-4 col-md-3">
          <label for="quantity" class="form-label small">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            class="form-control"
            min="1"
            value="1"
          />
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary me-2">
            Add to Cart
          </button>
          <a href="products.html" class="btn btn-outline-secondary">
            Back to Products
          </a>
        </div>
      </form>
    </div>
  `;

  const detailForm = document.getElementById("detail-form");
  if (detailForm) {
    detailForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const qtyInput = document.getElementById("quantity");
      const qty = qtyInput ? Number(qtyInput.value) : 1;
      addToCart(product.id, qty);
    });
  }
}

function formatCurrency(value) {
  // Format as Indian Rupee with grouping, e.g. ₹1,234.00
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  } catch (e) {
    // Fallback
    return `₹${value.toFixed(2)}`;
  }
}

function renderCartPage() {
  const tableBody = document.getElementById("cart-items");
  const cartEmpty = document.getElementById("cart-empty");
  const cartContent = document.getElementById("cart-content");
  const totalEl = document.getElementById("cart-total");

  if (!tableBody || !cartEmpty || !cartContent || !totalEl) return;

  const cart = getCart();
  if (cart.length === 0) {
    cartEmpty.classList.remove("d-none");
    cartContent.classList.add("d-none");
    totalEl.textContent = formatCurrency(0);
    return;
  }

  cartEmpty.classList.add("d-none");
  cartContent.classList.remove("d-none");

  tableBody.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const product = findProductById(item.id);
    if (!product) return;
    const subtotal = product.price * item.quantity;
    total += subtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.name}</td>
      <td class="text-end">${formatCurrency(product.price)}</td>
      <td class="text-center">
        <input
          type="number"
          class="form-control form-control-sm d-inline-block text-center"
          style="max-width: 80px;"
          min="1"
          value="${item.quantity}"
          data-cart-qty="${item.id}"
        />
      </td>
      <td class="text-end">${formatCurrency(subtotal)}</td>
      <td class="text-center">
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          data-remove-from-cart="${item.id}"
        >
          Remove
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  totalEl.textContent = formatCurrency(total);

  // Attach listeners for quantity changes
  tableBody.querySelectorAll("input[data-cart-qty]").forEach((input) => {
    input.addEventListener("change", (event) => {
      const id = event.target.getAttribute("data-cart-qty");
      const value = Number(event.target.value);
      if (!id) return;
      if (isNaN(value) || value < 1) {
        showFeedback("Quantity must be at least 1.", "danger");
        event.target.value = 1;
        return;
      }
      const cart = getCart();
      const item = cart.find((i) => i.id === id);
      if (item) {
        item.quantity = value;
        saveCart(cart);
        updateCartCount();
        renderCartPage();
      }
    });
  });

  // Attach listeners for remove buttons
  tableBody.querySelectorAll("button[data-remove-from-cart]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = event.target.getAttribute("data-remove-from-cart");
      if (!id) return;
      let cart = getCart();
      const product = findProductById(id);
      cart = cart.filter((item) => item.id !== id);
      saveCart(cart);
      updateCartCount();
      renderCartPage();
      if (product) {
        showFeedback(`“${product.name}” was removed from your cart.`, "info");
      }
    });
  });
}

function setupAddToCartButtons() {
  document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = event.currentTarget.getAttribute("data-add-to-cart");
      if (!id) return;
      addToCart(id, 1);
    });
  });
}

function setupCheckoutPage() {
  const form = document.getElementById("checkout-form");
  const successBox = document.getElementById("checkout-success");
  const emptyCartAlert = document.getElementById("checkout-empty-cart");

  const cart = getCart();
  if (emptyCartAlert && form && successBox) {
    if (cart.length === 0) {
      emptyCartAlert.classList.remove("d-none");
      form.classList.add("d-none");
      successBox.classList.add("d-none");
      return;
    }
  }

  if (!form || !successBox) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Simple manual validation
    let isValid = true;

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const address = document.getElementById("address");

    [fullName, email, phone, address].forEach((field) => {
      if (!field) return;
      if (!field.value.trim()) {
        field.classList.add("is-invalid");
        isValid = false;
      } else {
        field.classList.remove("is-invalid");
      }
    });

    if (email && email.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        email.classList.add("is-invalid");
        isValid = false;
      }
    }

    if (phone && phone.value.trim()) {
      const digits = phone.value.replace(/\D/g, "");
      if (digits.length < 7) {
        phone.classList.add("is-invalid");
        isValid = false;
      }
    }

    if (!isValid) {
      showFeedback(
        "Please correct the highlighted fields before submitting the form.",
        "danger"
      );
      return;
    }

    // Success: clear cart and show confirmation
    localStorage.removeItem("simpleShopCart");
    updateCartCount();
    form.reset();
    form.classList.add("d-none");
    successBox.classList.remove("d-none");
    showFeedback("Your details have been submitted successfully.", "success");
  });
}

function setYear() {
  const yearEls = document.querySelectorAll("#year");
  const year = new Date().getFullYear();
  yearEls.forEach((el) => (el.textContent = year));
}

function setupLoginPage() {
  const form = document.getElementById("login-form");
  const successBox = document.getElementById("login-success");
  if (!form || !successBox) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let isValid = true;
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");

    [email, password].forEach((field) => {
      if (!field) return;
      if (!field.value.trim()) {
        field.classList.add("is-invalid");
        isValid = false;
      } else {
        field.classList.remove("is-invalid");
      }
    });

    if (email && email.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        email.classList.add("is-invalid");
        isValid = false;
      }
    }

    if (!isValid) {
      showFeedback("Please fill in your email and password.", "danger");
      return;
    }

    // Demo-only: remember user email in localStorage
    localStorage.setItem(
      "simpleShopUser",
      JSON.stringify({ email: email.value.trim() })
    );
    form.reset();
    successBox.classList.remove("d-none");
    showFeedback("You are now logged in for this demo session.", "success");
  });
}

// --- Page initialisation ---
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  setYear();

  const page = document.body.getAttribute("data-page");

  if (page === "home") {
    renderFeaturedProducts();
    setupAddToCartButtons();
  }

  if (page === "products") {
    renderProductGrid();
    setupAddToCartButtons();
  }

  if (page === "product-details") {
    renderProductDetail();
  }

  if (page === "cart") {
    renderCartPage();
  }

  if (page === "checkout") {
    setupCheckoutPage();
  }

  if (page === "login") {
    setupLoginPage();
  }
});

