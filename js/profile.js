/* =========================================
   ZENITH PROFILE PAGE
========================================= */

const PROFILE_KEY = "zen_profile";

const DEFAULT_PROFILE = {
  name: "Alex Johnson",
  email: "alex@example.com",
  phone: "+91 98765 43210",

  address: {
    name: "Alex Johnson",
    line1: "42 Future Avenue",
    city: "Nashik",
    state: "Maharashtra",
    pincode: "422001",
    country: "India"
  }
};


/* =========================================
   PROFILE STORAGE
========================================= */

const Profile = {

  read() {
    try {
      return JSON.parse(
        localStorage.getItem(PROFILE_KEY)
      ) || DEFAULT_PROFILE;
    } catch (e) {
      return DEFAULT_PROFILE;
    }
  },

  write(data) {
    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(data)
    );
  },

  update(changes) {

    const current = this.read();

    const updated = {
      ...current,
      ...changes
    };

    this.write(updated);

    return updated;
  }

};


/* =========================================
   DEMO ORDERS
========================================= */

const DEMO_ORDERS = [
  {
    id: "ZEN-1028",
    date: "Aug 24, 2026",
    status: "Delivered",
    statusClass: "delivered",
    items: [
      {
        name: "Nova Pods Pro",
        qty: 1,
        price: 129.99,
        img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=300&q=80"
      }
    ],
    total: 129.99
  },

  {
    id: "ZEN-1021",
    date: "Aug 18, 2026",
    status: "Shipped",
    statusClass: "shipped",
    items: [
      {
        name: "Aura Studio Headphones",
        qty: 1,
        price: 299,
        img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80"
      }
    ],
    total: 299
  },

  {
    id: "ZEN-1014",
    date: "Aug 09, 2026",
    status: "Delivered",
    statusClass: "delivered",
    items: [
      {
        name: "Pulse Smartwatch X",
        qty: 1,
        price: 199.99,
        img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80"
      }
    ],
    total: 199.99
  }
];


/* =========================================
   HELPERS
========================================= */

const profileMoney = value => {

  if (typeof fmt === "function") {
    return fmt(value);
  }

  return "$" + Number(value).toFixed(2);
};


const firstName = name => {

  return (name || "Alex")
    .trim()
    .split(/\s+/)[0];

};


const avatarLetter = name => {

  return (name || "A")
    .trim()
    .charAt(0)
    .toUpperCase();

};


/* =========================================
   PROFILE DATA
========================================= */

function getProfileOrders() {

  try {

    const stored =
      JSON.parse(
        localStorage.getItem("zen_orders")
      );

    if (Array.isArray(stored)) {
      return stored;
    }

  } catch (e) {}

  return DEMO_ORDERS;
}


/* =========================================
   PROFILE UI
========================================= */

const ProfileUI = {


  renderUser() {

    const profile = Profile.read();

    const name = profile.name || "Alex Johnson";
    const email = profile.email || "alex@example.com";
    const letter = avatarLetter(name);


    const heroName =
      document.querySelector("#profile-hero-name");

    if (heroName) {
      heroName.textContent =
        firstName(name) + ".";
    }


    const miniName =
      document.querySelector("#profile-mini-name");

    if (miniName) {
      miniName.textContent = name;
    }


    const miniEmail =
      document.querySelector("#profile-mini-email");

    if (miniEmail) {
      miniEmail.textContent = email;
    }


    const sideName =
      document.querySelector("#side-user-name");

    if (sideName) {
      sideName.textContent = name;
    }


    [
      "#profile-avatar-letter",
      "#side-avatar-letter",
      "#personal-avatar-letter"
    ].forEach(selector => {

      const el =
        document.querySelector(selector);

      if (el) {
        el.textContent = letter;
      }

    });


    const personalName =
      document.querySelector("#personal-name");

    if (personalName) {
      personalName.textContent = name;
    }


    const personalEmail =
      document.querySelector("#personal-email");

    if (personalEmail) {
      personalEmail.textContent = email;
    }


    const personalPhone =
      document.querySelector("#personal-phone");

    if (personalPhone) {
      personalPhone.textContent =
        profile.phone || "Not added";
    }


    this.renderAddress(profile);

  },


  renderAddress(profile) {

    const address =
      profile.address;

    const el =
      document.querySelector("#address-display");

    if (!el || !address) {
      return;
    }

    el.innerHTML = `
      ${address.name}<br>
      ${address.line1}<br>
      ${address.city}, ${address.state} ${address.pincode}<br>
      ${address.country}
    `;

  },


  renderStats() {

    const orders =
      getProfileOrders();

    const wishlist =
      typeof Wish !== "undefined"
        ? Wish.all()
        : [];


    const orderCount =
      orders.length;


    const wishlistCount =
      wishlist.length;


    const totalSpent =
      orders.reduce(
        (sum, order) =>
          sum + Number(order.total || 0),
        0
      );


    const setText = (selector, value) => {

      const el =
        document.querySelector(selector);

      if (el) {
        el.textContent = value;
      }

    };


    setText("#orders-count", orderCount);
    setText("#nav-orders-count", orderCount);
    setText("#orders-total-label", orderCount);

    setText("#wishlist-count", wishlistCount);
    setText("#nav-wishlist-count", wishlistCount);

    setText(
      "#spent-count",
      profileMoney(totalSpent)
    );

  },


  renderOrders() {

    const orders =
      getProfileOrders();


    const overview =
      document.querySelector("#overview-orders");

    const full =
      document.querySelector("#full-orders");


    const markup =
      orders.map(order => {

        const firstItem =
          order.items?.[0] || {};


        const extra =
          order.items?.length > 1
            ? `+${order.items.length - 1} more`
            : "";


        return `
          <article class="order-card">

            <div class="order-product">

              <div class="order-thumb">
                <img
                  src="${firstItem.img || ""}"
                  alt="${firstItem.name || "Product"}"
                  loading="lazy"
                >
              </div>

              <div class="order-info">

                <span class="order-id">
                  #${order.id}
                </span>

                <h4>
                  ${firstItem.name || "ZENITH order"}
                </h4>

                <small>
                  ${order.date}
                  ${extra ? ` · ${extra}` : ""}
                </small>

              </div>

            </div>


            <div class="order-middle">

              <span class="order-status ${order.statusClass}">
                <i></i>
                ${order.status}
              </span>

            </div>


            <div class="order-price">

              <b>
                ${profileMoney(order.total)}
              </b>

              <button
                class="order-view"
                data-order="${order.id}"
              >
                View
              </button>

            </div>

          </article>
        `;

      }).join("");


    if (overview) {

      overview.innerHTML =
        orders.length
          ? orders.slice(0, 3).map(renderOrderCompact).join("")
          : emptyOrders();

    }


    if (full) {

      full.innerHTML =
        orders.length
          ? markup
          : emptyOrders();

    }

  },


  renderWishlist() {

    const grid =
      document.querySelector(
        "#profile-wishlist-grid"
      );

    if (!grid) {
      return;
    }


    const wishlist =
      typeof Wish !== "undefined"
        ? Wish.all()
        : [];


    if (!wishlist.length) {

      grid.innerHTML = `
        <div class="profile-empty wishlist-empty">

          <div class="empty-symbol">
            ♡
          </div>

          <h3>
            Nothing saved yet.
          </h3>

          <p>
            Your next favourite might be
            one scroll away.
          </p>

          <a
            href="shop.html"
            class="btn btn-dark"
          >
            Explore products
          </a>

        </div>
      `;

      return;
    }


    const products =
      wishlist
        .map(id =>
          typeof zenProduct === "function"
            ? zenProduct(id)
            : null
        )
        .filter(Boolean);


    grid.innerHTML =
      products.map(product => `

        <article
          class="profile-wish-card"
          data-reveal
        >

          <a
            href="product.html?id=${product.id}"
            class="profile-wish-image"
          >

            <img
              src="${product.img}"
              alt="${product.name}"
              loading="lazy"
            >

            ${
              product.badge
                ? `<span class="profile-wish-badge">
                    ${product.badge}
                   </span>`
                : ""
            }

          </a>


          <div class="profile-wish-body">

            <span>
              ${product.cat}
            </span>

            <h3>
              ${product.name}
            </h3>

            <div>

              <b>
                ${profileMoney(product.price)}
              </b>

              <button
                class="profile-remove-wish"
                data-remove-wish="${product.id}"
                aria-label="Remove from wishlist"
              >
                ×
              </button>

            </div>

          </div>

        </article>

      `).join("");


    if (typeof UI !== "undefined") {
      UI.observe(grid);
    }

  },


  renderAll() {

    this.renderUser();
    this.renderStats();
    this.renderOrders();
    this.renderWishlist();

  }

};


/* =========================================
   COMPACT ORDER
========================================= */

function renderOrderCompact(order) {

  const item =
    order.items?.[0] || {};


  return `
    <article class="order-card compact">

      <div class="order-product">

        <div class="order-thumb">
          <img
            src="${item.img || ""}"
            alt="${item.name || "Product"}"
            loading="lazy"
          >
        </div>

        <div class="order-info">

          <span class="order-id">
            #${order.id}
          </span>

          <h4>
            ${item.name || "ZENITH order"}
          </h4>

          <small>
            ${order.date}
          </small>

        </div>

      </div>


      <div class="order-price">

        <b>
          ${profileMoney(order.total)}
        </b>

        <span class="order-status ${order.statusClass}">
          <i></i>
          ${order.status}
        </span>

      </div>

    </article>
  `;

}


/* =========================================
   EMPTY ORDERS
========================================= */

function emptyOrders() {

  return `
    <div class="profile-empty">

      <div class="empty-symbol">
        ◌
      </div>

      <h3>
        No orders yet.
      </h3>

      <p>
        Your next order is waiting to happen.
      </p>

      <a
        href="shop.html"
        class="btn btn-dark"
      >
        Start shopping
      </a>

    </div>
  `;

}


/* =========================================
   TAB / NAVIGATION
========================================= */

function switchProfilePanel(name) {

  document
    .querySelectorAll("[data-profile-nav]")
    .forEach(btn => {

      btn.classList.toggle(
        "active",
        btn.dataset.profileNav === name
      );

    });


  document
    .querySelectorAll("[data-profile-panel]")
    .forEach(panel => {

      panel.classList.toggle(
        "active",
        panel.dataset.profilePanel === name
      );

    });


  window.scrollTo({
    top: document.querySelector(".profile-layout")
      ?.getBoundingClientRect().top
      + window.scrollY
      - 100 || 0,
    behavior: "smooth"
  });

}


/* =========================================
   EDIT PROFILE MODAL
========================================= */

function openProfileModal() {

  const modal =
    document.querySelector(
      "#profile-edit-modal"
    );

  const profile =
    Profile.read();


  if (!modal) {
    return;
  }


  document.querySelector("#edit-name").value =
    profile.name || "";


  document.querySelector("#edit-email").value =
    profile.email || "";


  document.querySelector("#edit-phone").value =
    profile.phone || "";


  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";


  setTimeout(() => {

    document
      .querySelector("#edit-name")
      ?.focus();

  }, 100);

}


function closeProfileModal() {

  const modal =
    document.querySelector(
      "#profile-edit-modal"
    );

  if (!modal) {
    return;
  }


  modal.classList.remove("open");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow = "";

}


/* =========================================
   PROFILE EVENTS
========================================= */

document.addEventListener("click", e => {

  const nav =
    e.target.closest(
      "[data-profile-nav]"
    );


  if (nav) {

    e.preventDefault();

    switchProfilePanel(
      nav.dataset.profileNav
    );

    return;

  }


  const stat =
    e.target.closest(
      "[data-profile-tab]"
    );


  if (stat) {

    switchProfilePanel(
      stat.dataset.profileTab
    );

    return;

  }


  if (
    e.target.closest("#open-edit-profile") ||
    e.target.closest("#edit-personal-btn")
  ) {

    openProfileModal();

    return;

  }


  if (
    e.target.closest("[data-close-profile-modal]")
  ) {

    closeProfileModal();

    return;

  }


  const remove =
    e.target.closest(
      "[data-remove-wish]"
    );


  if (remove) {

    const id =
      Number(remove.dataset.removeWish);


    if (typeof Wish !== "undefined") {

      Wish.toggle(id);

      ProfileUI.renderAll();

      if (typeof UI !== "undefined") {
        UI.refreshBadges();
      }

    }

    return;

  }


  const addAddress =
    e.target.closest(
      "#add-address-btn, #add-address-card"
    );


  if (addAddress) {

    alert(
      "Address management will be connected to the backend later."
    );

    return;

  }

});


/* =========================================
   SAVE PROFILE
========================================= */

document.addEventListener(
  "submit",
  e => {

    if (
      e.target.id !==
      "profile-edit-form"
    ) {
      return;
    }


    e.preventDefault();


    const name =
      document.querySelector(
        "#edit-name"
      ).value.trim();


    const email =
      document.querySelector(
        "#edit-email"
      ).value.trim();


    const phone =
      document.querySelector(
        "#edit-phone"
      ).value.trim();


    if (!name || !email) {
      return;
    }


    Profile.update({
      name,
      email,
      phone
    });


    ProfileUI.renderAll();

    closeProfileModal();


    if (
      typeof UI !== "undefined" &&
      UI.toast
    ) {

      UI.toast(
        "Profile updated successfully"
      );

    }

  }
);


/* =========================================
   KEYBOARD
========================================= */

document.addEventListener(
  "keydown",
  e => {

    if (e.key === "Escape") {
      closeProfileModal();
    }

  }
);


/* =========================================
   INIT
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    document.body.dataset.page =
      "profile";


    ProfileUI.renderAll();


    /*
      UI.observe() is already called
      from app.js after DOMContentLoaded.
    */

  }
);