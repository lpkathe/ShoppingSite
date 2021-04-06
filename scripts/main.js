const viewCart = document.getElementById("cart");
const btnCart = document.getElementById("header_cart");

const viewProducts = document.getElementById("products");

const modelCard = document.getElementById("card");
const fileJson = function () {
  fetch('products.json')
    .then(response => response.json())
    .then(json => console.log(json))
};

/**
 * Show and keep products and cart view.
 * @param {click} event 
 */
function cartPage(event) {
  viewCart.classList.toggle("cart_active");
  viewProducts.classList.toggle("products_inactive");
};

function createCards(json) {
  const clonedCard = modelCard.cloneNode(true);
  viewProducts.appendChild(clonedCard);
};

btnCart.addEventListener("click", cartPage);