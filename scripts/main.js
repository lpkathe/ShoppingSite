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
    } else {
      alert(`In stock ${product.stock} products only`);
    };
  } else {
    if ((productInCart[0].quantity + quantity) <= product.stock) {
      productInCart[0].quantity += quantity;
    } else {
      alert(`You can add ${(productInCart[0].quantity + quantity) - product.stock} more items.`);
    };
  };
  cartCounter.innerText = shoppingCart.length
};

btnCart.addEventListener("click", cartPage);