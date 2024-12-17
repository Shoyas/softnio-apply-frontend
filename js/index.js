
// Cart Variables
let cartCount = 0;
let cartItems = [];
let selectedSize = "M";
let selectedColor = "#816BFF"; // Default color

// DOM Elements
const quantityInput = document.getElementById("quantity");
const cartCountElement = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartItemsTable = document.getElementById("cart-items-table");
const totalQuantityElement = document.getElementById("total-quantity");
const totalPriceElement = document.getElementById("total-price");
const originalPriceElement = document.querySelector(".original-price");
const currentPriceElement = document.querySelector(".price");
const productImage = document.querySelector(".image-section img");

// Color and Size Mappings
const colorMap = {
    '#816BFF': { name: 'Purple', image: './images/one.jpg' },
    '#1FCEC9': { name: 'Cyan', image: './images/four.jpg' },
    '#4B97D3': { name: 'Deep Teal', image: './images/three.jpg' },
    '#3B4747': { name: 'Black', image: './images/two.jpg' }
};

const sizePrices = {
    'S': 69.00,
    'M': 79.00,
    'L': 89.00,
    'XL': 99.00
};

// Function to update displayed prices
function updateDisplayedPrices() {
    const price = sizePrices[selectedSize];
    const originalPrice = 99.00;

    originalPriceElement.textContent = `$${originalPrice.toFixed(2)}`;
    currentPriceElement.textContent = `$${price.toFixed(2)}`;
}

// Function to update the product image
function updateProductImage() {
    const imageUrl = colorMap[selectedColor].image;
    productImage.src = imageUrl;
}

// Quantity Controls
document.getElementById("increase").addEventListener("click", () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
});

document.getElementById("decrease").addEventListener("click", () => {
    if (parseInt(quantityInput.value) > 0) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
});

// Size Selection
document.querySelectorAll(".sizes button").forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".sizes button").forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");
        selectedSize = button.getAttribute("data-size");
        updateDisplayedPrices(); // Update price when size changes
    });
});

// Color Selection
document.querySelectorAll(".colors .span").forEach((colorDiv) => {
    colorDiv.addEventListener("click", () => {
        document.querySelectorAll(".colors .span").forEach((div) => div.classList.remove("selected"));
        colorDiv.classList.add("selected");
        selectedColor = colorDiv.getAttribute("data-color");
        updateProductImage(); // Update image when color changes
    });
});

// Visiblity of checkout button
function updateCheckoutVisibility() {
    const checkoutElement = document.getElementById("checkout");
    const cartCount = parseInt(document.getElementById("cart-count").textContent);

    if (cartCount > 0) {
        checkoutElement.style.display = "block";
    } else {
        checkoutElement.style.display = "none";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    updateCheckoutVisibility();
});

// Add to Cart
document.getElementById("add-to-cart").addEventListener("click", () => {
    const quantity = parseInt(quantityInput.value);
    if (quantity > 0) {
        const colorName = colorMap[selectedColor].name;
        const pricePerItem = sizePrices[selectedSize];
        const totalItemPrice = pricePerItem * quantity;

        // Find if an existing cart item matches the current selection
        const existingItemIndex = cartItems.findIndex(
            item => item.color === colorName && item.size === selectedSize
        );

        if (existingItemIndex !== -1) {
            // If item exists, update its quantity and total price
            cartItems[existingItemIndex].quantity += quantity;
            cartItems[existingItemIndex].totalPrice += totalItemPrice;
        } else {
            // If no matching item, add a new cart item
            const cartItem = {
                size: selectedSize,
                color: colorName,
                quantity: quantity,
                pricePerItem: pricePerItem,
                totalPrice: totalItemPrice
            };
            cartItems.push(cartItem);
        }

        // Update cart count
        cartCount += quantity;
        cartCountElement.textContent = cartCount;

        // Update cart visibility
        updateCheckoutVisibility();

        // Update modal content
        updateCartModal();

        // alert("Item added to cart!");
    } else {
        alert("Please select a valid quantity.");
    }
});

// Update Cart Modal
function updateCartModal() {
    cartItemsTable.innerHTML = ""; // Clear previous items
    let totalItems = 0;
    let totalPrice = 0;
    cartItems.forEach((item) => {
        // Find the color hex code for the item's color
        const colorHex = Object.keys(colorMap).find(
            hex => colorMap[hex].name === item.color
        );

        const row = document.createElement("tr");
        row.innerHTML = `
      <td>
        <div class="table-cart-img-name custom-table">
          <div>
            <img 
              src="${colorMap[colorHex].image}" 
              alt="Smartwatch" 
              class="cart_image" 
              style="width: 50px; height: 50px; object-fit: cover;"
            >
          </div>
          <div class="product-text-thin">
            <span>Classy Modern Smart Watch</span>
          </div>
        </div>
      </td>
      <td>
        <span class="product-text-thin">${item.color}</span>
      </td>
      <td>
        <span>${item.size}</span>
      </td>
      <td>
        <span>${item.quantity}</span>
      </td>
      <td>
        <span>$${item.totalPrice.toFixed(2)}</span>
      </td>
    `;
        cartItemsTable.appendChild(row);
        totalItems += item.quantity;
        totalPrice += item.totalPrice;
    });

    // Update modal totals
    totalQuantityElement.textContent = totalItems;
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}
// Modal Controls
document.getElementById("checkout").addEventListener("click", () => {
    cartModal.classList.remove("hidden");
});

document.getElementById("close-modal").addEventListener("click", () => {
    cartModal.classList.add("hidden");
});

document.getElementById("continue-shopping").addEventListener("click", () => {
    cartModal.classList.add("hidden");
});

// Close modal if clicked outside of cart
cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal) {
        cartModal.classList.add("hidden");
    }
});

// Initialize the default displayed price and image
updateDisplayedPrices();
updateProductImage();

