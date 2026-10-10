
/*
  E-Commerce Shopping Platform
  Cart Page — Work in Progress
  Completed:
  - Display cart items
  - Increase/decrease quantity
  - Remove items
  - Calculate subtotal and total
  Pending:
  - Promo code validation
  - Persistent cart storage
  - Checkout integration
*/

const cart = [
  {
    id: 1,
    name: "Kira Ceramic Vase",
    variant: "Matte White",
    price: 245,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 2,
    name: "Linen Throw Blanket",
    variant: "Oatmeal",
    price: 180,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=200&q=80"
  }
];

const money = amount => `₹${amount.toFixed(2)}`;
function renderCart() {
  const container = document.getElementById("cart-items");

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Discover something you'll love.</p>
        <a href="index.html">Continue shopping</a>
      </div>
    `;
  } else {
    container.innerHTML = cart.map(item => `
      <article class="cart-item">
        <img src="${item.image}" alt="${item.name}">

        <div class="item-info">
          <div>
            <h3>${item.name}</h3>
            <p>${item.variant}</p>
          </div>

          <div class="quantity">
            <button data-action="decrease" data-id="${item.id}"
              aria-label="Decrease quantity">−</button>

            <span>${item.quantity}</span>

            <button data-action="increase" data-id="${item.id}"
              aria-label="Increase quantity">+</button>
          </div>
        </div>

        <div class="item-end">
          <button class="remove" data-action="remove"
            data-id="${item.id}" aria-label="Remove ${item.name}">×</button>

          <span class="item-price">
            ${money(item.price * item.quantity)}
          </span>
        </div>
      </article>
    `).join("");
  }

  updateSummary();
}
function updateSummary() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  document.getElementById("subtotal").textContent = money(subtotal);
  document.getElementById("discount").textContent = "-₹0.00";
  document.getElementById("total").textContent = money(subtotal);
}
document.getElementById("cart-items").addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const id = Number(button.dataset.id);
  const item = cart.find(product => product.id === id);

  if (!item) return;

  if (button.dataset.action === "increase") {
    item.quantity++;
  } else if (button.dataset.action === "decrease") {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      cart.splice(cart.indexOf(item), 1);
    }
  } else if (button.dataset.action === "remove") {
    cart.splice(cart.indexOf(item), 1);
  }

  renderCart();
});

document.getElementById("checkout").addEventListener("click", () => {
  document.getElementById("checkout-message").textContent =
    "Checkout functionality is currently under development.";
});



