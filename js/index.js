let cartCount = 0;
let cartItems = [];
let selectedSize = "M"; 
let selectedColor = "#816BFF"; 

const quantityInput = document.getElementById("quantity");
const cartCountElement = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartItemsTable = document.getElementById("cart-items-table");
const totalQuantityElement = document.getElementById("total-quantity");
const totalPriceElement = document.getElementById("total-price");
const originalPriceElement = document.querySelector(".original-price");
const currentPriceElement = document.querySelector(".price");
const productImage = document.querySelector(".image-section img");
const addToCartBtn = document.getElementById("add-to-cart");
const wishlistBtn = document.getElementById("wishlist");

//! Here is the Color and Size Mappings
const colorMap = {
    '#816BFF': { name: 'Purple', image: './images/Purple.jpg' },
    '#1FCEC9': { name: 'Cyan', image: './images/Cyan.jpg' },
    '#4B97D3': { name: 'Deep Teal', image: './images/Deep-Teal.jpg' },
    '#3B4747': { name: 'Black', image: './images/Black.jpg' }
};

const sizePrices = {
    'S': 69.00,
    'M': 79.00,
    'L': 89.00,
    'XL': 99.00
};

//! Here is the update function of displayed prices
function updateDisplayedPrices() {
    const price = sizePrices[selectedSize];
    let originalPrice;

    switch (price) {
        case 69.00:
            originalPrice = 59.00;
            break;
        case 79.00:
            originalPrice = 69.00;
            break;
        case 89.00:
            originalPrice = 79.00;
            break;
        case 99.00:
            originalPrice = 89.00;
            break;
        default:
            originalPrice = price;
    }

    originalPriceElement.textContent = `$${originalPrice.toFixed(2)}`;
    currentPriceElement.textContent = `$${price.toFixed(2)}`;
}


//! Here is the update function of product image
function updateProductImage() {
    const imageUrl = colorMap[selectedColor].image;
    productImage.src = imageUrl;
}

//! Update Add to Cart button's state
function updateAddToCartState() {
    if (parseInt(quantityInput.value) === 0) {
        addToCartBtn.disabled = true;
    } else {
        addToCartBtn.disabled = false;
    }
}

//! Quantity Controlling area
document.getElementById("increase").addEventListener("click", () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
    updateAddToCartState(); 
});

document.getElementById("decrease").addEventListener("click", () => {
    if (parseInt(quantityInput.value) > 0) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
    updateAddToCartState(); 
});

//! Here is Size Selecting
document.querySelectorAll(".sizes button").forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".sizes button").forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");
        selectedSize = button.getAttribute("data-size");
        //! Update function price when size change
        updateDisplayedPrices(); 
    });
});

//! Here is Color Selecting
document.querySelectorAll(".colors .span").forEach((colorDiv) => {
    colorDiv.addEventListener("click", () => {
        document.querySelectorAll(".colors .span").forEach((div) => div.classList.remove("selected"));
        colorDiv.classList.add("selected");
        selectedColor = colorDiv.getAttribute("data-color");
        //! Update function image when color change 
        updateProductImage(); 
    });
});

//! Wishlist Button Toggle
wishlistBtn.addEventListener("click", () => {
    wishlistBtn.classList.toggle("active");
});

//! Visibility of Checkout Button
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

//! Adding to Cart
addToCartBtn.addEventListener("click", () => {
    const quantity = parseInt(quantityInput.value);
    if (quantity > 0) {
        const colorName = colorMap[selectedColor].name;
        const pricePerItem = sizePrices[selectedSize];
        const totalItemPrice = pricePerItem * quantity;

        //! Find if any product is existing cart item matches
        const existingItemIndex = cartItems.findIndex(
            item => item.color === colorName && item.size === selectedSize
        );

        if (existingItemIndex !== -1) {
            //! If any item exists, update quantity and price
            cartItems[existingItemIndex].quantity += quantity;
            cartItems[existingItemIndex].totalPrice += totalItemPrice;
        } else {
            //! If not matching item, add a new cart item
            const cartItem = {
                size: selectedSize,
                color: colorName,
                quantity: quantity,
                pricePerItem: pricePerItem,
                totalPrice: totalItemPrice
            };
            cartItems.push(cartItem);
        }

        //! Update cart count
        cartCount += quantity;
        cartCountElement.textContent = cartCount;

        //! Update cart visibility
        updateCheckoutVisibility();

        //! Update modal content
        updateCartModal();
    } else {
        alert("Please select a valid quantity.");
    }
});

//! Update Cart Modal
function updateCartModal() {
    cartItemsTable.innerHTML = "";
    let totalItems = 0;
    let totalPrice = 0;
    cartItems.forEach((item) => {
        //! Find image by color 
        const findImageByColor = Object.keys(colorMap).find(
            code => colorMap[code].name === item.color
        );

        const row = document.createElement("tr");
        row.innerHTML = `
      <td>
        <div class="table-cart-img-name custom-table">
          <div>
            <img 
              src="${colorMap[findImageByColor].image}" 
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

    //! Update modal's total items and price
    totalQuantityElement.textContent = totalItems;
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

//! Modal Controlling
document.getElementById("checkout").addEventListener("click", () => {
    cartModal.classList.remove("hidden");
});

document.getElementById("close-modal").addEventListener("click", () => {
    cartModal.classList.add("hidden");
});

document.getElementById("continue-shopping").addEventListener("click", () => {
    cartModal.classList.add("hidden");
});

//! Close modal if clicked outside of cart
cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal) {
        cartModal.classList.add("hidden");
    }
});

//! Initialize the default displayed price and image by the bellow functions
updateDisplayedPrices();
updateProductImage();
updateAddToCartState();
