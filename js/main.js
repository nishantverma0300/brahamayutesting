/* ==============================
   BRAHAMAYU NEW WEBSITE - PART 1 JS
================================= */

const body = document.body;

const pageOverlay = document.getElementById("pageOverlay");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuClose = document.getElementById("mobileMenuClose");

const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartClose = document.getElementById("cartClose");

const desktopSearchForm = document.getElementById("desktopSearchForm");
const desktopSearchInput = document.getElementById("desktopSearchInput");
const desktopSearchSuggestions = document.getElementById("desktopSearchSuggestions");

const mobileSearchForm = document.getElementById("mobileSearchForm");
const mobileSearchInput = document.getElementById("mobileSearchInput");

const accordions = document.querySelectorAll(".mobile-accordion");

/* ------------------------------
   Common helpers
------------------------------ */

function openOverlay() {
  pageOverlay.classList.add("active");
  body.classList.add("no-scroll");
}

function closeOverlay() {
  pageOverlay.classList.remove("active");
  body.classList.remove("no-scroll");
}

function closeAllDrawers() {
  mobileMenu.classList.remove("active");
  cartDrawer.classList.remove("active");
  closeOverlay();
}

/* ------------------------------
   Mobile menu
------------------------------ */

mobileMenuBtn.addEventListener("click", () => {
  cartDrawer.classList.remove("active");
  mobileMenu.classList.add("active");
  openOverlay();
});

mobileMenuClose.addEventListener("click", closeAllDrawers);

/* ------------------------------
   Cart drawer
------------------------------ */

cartBtn.addEventListener("click", () => {
  mobileMenu.classList.remove("active");
  cartDrawer.classList.add("active");
  openOverlay();
});

cartClose.addEventListener("click", closeAllDrawers);

/* ------------------------------
   Overlay close
------------------------------ */

pageOverlay.addEventListener("click", closeAllDrawers);

/* ------------------------------
   ESC key close
------------------------------ */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllDrawers();

    if (desktopSearchSuggestions) {
      desktopSearchSuggestions.classList.remove("active");
    }
  }
});

/* ------------------------------
   Mobile accordion menu
------------------------------ */

accordions.forEach((accordion) => {
  accordion.addEventListener("click", () => {
    const submenu = accordion.nextElementSibling;
    const icon = accordion.querySelector("span");

    accordion.classList.toggle("active");
    submenu.classList.toggle("active");

    icon.textContent = submenu.classList.contains("active") ? "−" : "+";
  });
});

/* ------------------------------
   Desktop search suggestions
------------------------------ */

desktopSearchInput.addEventListener("focus", () => {
  desktopSearchSuggestions.classList.add("active");
});

desktopSearchInput.addEventListener("input", () => {
  desktopSearchSuggestions.classList.add("active");
});

document.addEventListener("click", (event) => {
  const isSearchArea = desktopSearchForm.contains(event.target);

  if (!isSearchArea) {
    desktopSearchSuggestions.classList.remove("active");
  }
});

/* ------------------------------
   Search submit
------------------------------ */

desktopSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = desktopSearchInput.value.trim();

  if (!query) {
    desktopSearchInput.focus();
    return;
  }

  window.location.href = `products.html?search=${encodeURIComponent(query)}`;
});

mobileSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = mobileSearchInput.value.trim();

  if (!query) {
    mobileSearchInput.focus();
    return;
  }

  window.location.href = `products.html?search=${encodeURIComponent(query)}`;
});

/* ------------------------------
   Sticky header shadow on scroll
------------------------------ */

const siteHeader = document.getElementById("siteHeader");

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    siteHeader.style.boxShadow = "0 8px 28px rgba(0, 0, 0, 0.10)";
  } else {
    siteHeader.style.boxShadow = "0 4px 18px rgba(0, 0, 0, 0.06)";
  }
});

/* ==============================
   PART 4 - PRODUCT CART FUNCTIONALITY
================================= */

let cart = [];

const addCartButtons = document.querySelectorAll(".add-cart-btn");
const buyNowButtons = document.querySelectorAll(".buy-now-btn");

function getProductFromButton(button) {
  return {
    id: button.dataset.id,
    name: button.dataset.name,
    price: Number(button.dataset.price),
    image: button.dataset.image,
    qty: 1
  };
}

function addToCart(product, openCart = true) {
  const existingProduct = cart.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.qty += 1;
  } else {
    cart.push(product);
  }

  updateCartUI();

  if (openCart) {
    mobileMenu.classList.remove("active");
    cartDrawer.classList.add("active");
    openOverlay();
  }
}

function updateCartUI() {
  const cartCount = document.getElementById("cartCount");
  const cartSmallText = document.getElementById("cartSmallText");
  const cartBody = document.getElementById("cartBody");
  const cartSubtotal = document.getElementById("cartSubtotal");

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCount.textContent = totalItems;
  cartSmallText.textContent = `${totalItems} item${totalItems !== 1 ? "s" : ""} in your cart`;
  cartSubtotal.textContent = `₹${subtotal}`;

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h4>Your cart is empty</h4>
        <p>Add Ayurvedic wellness products to start your order.</p>
        <a href="products.html" class="primary-btn">Shop Products</a>
      </div>
    `;
    return;
  }

  cartBody.innerHTML = cart.map((item) => {
    return `
      <div class="cart-item">
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.name}">
        </div>

        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-price">₹${item.price}</div>

          <div class="cart-item-bottom">
            <div class="qty-box">
              <button class="qty-btn decrease-qty" data-id="${item.id}">−</button>
              <span class="qty-number">${item.qty}</span>
              <button class="qty-btn increase-qty" data-id="${item.id}">+</button>
            </div>

            <button class="remove-cart-btn" data-id="${item.id}">
              Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

addCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const product = getProductFromButton(button);
    addToCart(product, true);
  });
});

buyNowButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const product = getProductFromButton(button);
    addToCart(product, false);
    window.location.href = "checkout.html";
  });
});

document.addEventListener("click", (event) => {
  const increaseBtn = event.target.closest(".increase-qty");
  const decreaseBtn = event.target.closest(".decrease-qty");
  const removeBtn = event.target.closest(".remove-cart-btn");

  if (increaseBtn) {
    const productId = increaseBtn.dataset.id;
    const item = cart.find((product) => product.id === productId);

    if (item) {
      item.qty += 1;
      updateCartUI();
    }
  }

  if (decreaseBtn) {
    const productId = decreaseBtn.dataset.id;
    const item = cart.find((product) => product.id === productId);

    if (item) {
      item.qty -= 1;

      if (item.qty <= 0) {
        cart = cart.filter((product) => product.id !== productId);
      }

      updateCartUI();
    }
  }

  if (removeBtn) {
    const productId = removeBtn.dataset.id;
    cart = cart.filter((product) => product.id !== productId);
    updateCartUI();
  }
});

/* ==============================
   PART 6 - OFFER CART BUTTONS
================================= */

const offerCartButtons = document.querySelectorAll(".offer-cart-btn");

offerCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const product = getProductFromButton(button);
    addToCart(product, true);
  });
});
