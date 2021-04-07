const viewCart = document.getElementById("cart");
const btnCart = document.getElementById("headerCart");

const cartCounter = document.getElementById("cartCounter");
const viewProducts = document.getElementById("products");

const modelCard = document.getElementById("card");
let stockProducts = [];

let shoppingCart = [];

const loadInfo = function () {
  fetch('scripts/products.json')
    .then(response => response.json())
    .then(json => {
      json.products.forEach((element, index) => createCards(element, index));
      stockProducts = json.products;
    })
};
loadInfo()

/**
 * Show and keep products and cart view.
 * @param {click} event 
 */
function cartPage(event) {
  viewCart.classList.toggle("cart_active");
  viewProducts.classList.toggle("products_inactive");
};

/**
 * Clone a card model for each product within the JSON file.
 * @param {JSON Objet} element 
 */
function createCards(element, index) {
  const clonedCard = modelCard.cloneNode(true);
  viewProducts.appendChild(clonedCard);
  const desiredQuantity = clonedCard.querySelector(".desiredQuantity");
  desiredQuantity.setAttribute("max", `${element.stock}`);
  clonedCard.setAttribute("id", index);
  //desiredQuantity.setAttribute("oninput", "validity.valid||(value='')");
  clonedCard.querySelector(".btnAddCart").addEventListener("click", addToCart);
  clonedCard.style.display = "block";
  validateStock(element.stock, clonedCard);
};

function validateStock(stock, card) {
  const cardMessage = card.querySelector(".card_alert");
  if (stock == 0) {
    card.style.opacity = "0.5";
    cardMessage.style.display = "block";
  } else {
    card.style.opacity = "1";
    cardMessage.style.display = "none";
  }
};

function addToCart(event) {
  const item = event.target.closest("div");
  const productNumber = item.id;
  const product = stockProducts[productNumber];
  const quantity = parseInt(item.querySelector(".desiredQuantity").value);

  const productInCart = shoppingCart.filter(data => data.product == product);

  if (productInCart.length == 0) {
    if (quantity <= product.stock) {
      const itemCart = {
        "product": product,
        "quantity": quantity,
      };
      shoppingCart.push(itemCart);
      validateStock(quantity - product.stock, item);
    } else {
      alert(`In stock ${product.stock} products only`);
    }
  } else {
    if ((productInCart[0].quantity + quantity) <= product.stock) {
      productInCart[0].quantity += quantity;
      validateStock(productInCart[0].quantity - product.stock, item);
    } else {
      alert(`You can add ${(product.stock - productInCart[0].quantity)} items only.`);
    }
  }
  cartCounter.innerText = shoppingCart.length;
};

btnCart.addEventListener("click", cartPage);