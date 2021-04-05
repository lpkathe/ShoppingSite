const viewCart = document.getElementById("cart");
const btnCart = document.getElementById("header_cart");

const viewProducts = document.getElementById("products");

function cartPage (event) {
 viewCart.classList.toggle("cart_active");
 viewProducts.classList.toggle("products_inactive");
};

btnCart.addEventListener("click", cartPage);