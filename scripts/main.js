const btnCart = document.getElementById("headerCart");
const btnOrder = document.querySelector(".btn_order");
const viewCart = document.getElementById("cart");
const title = document.querySelector(".header_title");

const cartCounter = document.getElementById("cartCounter");
const viewProducts = document.getElementById("products");

let stockProducts = [];
let shoppingCart = [];

let sumValues = 0;

/**
 * 
 */
function onLoad() {
  fetch('scripts/products.json')
    .then(response => response.json())
    .then(json => {
      json.products.forEach((element, index) => createCards(element, index));
      stockProducts = json.products;
    })

  if (window.screen.width < 1023) {
    title.addEventListener("click", productsPage);
    btnCart.addEventListener("click", cartPage);
  }

  loadCartItems();
};

/**
 * Show cart view and keep products view.
 * @param {click} event 
 */
function cartPage(event) {
  viewCart.className = "cart_active";
  viewProducts.className = "products_inactive";
  loadCartItems();
};

/**
 * Show products view and keep cart view.
 * @param {click} event 
 */
function productsPage(event) {
  viewCart.className = "cart";
  viewProducts.className = "products";
};

/**
 * Clone a card model for each product within the JSON file.
 * @param {JSON Objet} element 
 */
function createCards(element, index) {
  const modelCard = document.getElementById("card");
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

/**
 * Show the user if the product is available.
 * @param {Number} stock 
 * @param {Model card} card 
 */
function validateStock(stock, card) {
  const cardMessage = card.querySelector(".card_alert");
  const cardPhoto = card.querySelector(".card_photo");
  const btnAddCart = card.querySelector(".btnAddCart");
  const desiredQuantity = card.querySelector(".desiredQuantity");

  if (stock == 0) {
    cardPhoto.style.opacity = "0.5";
    cardMessage.style.display = "block";
    btnAddCart.style.display = "none";
    desiredQuantity.style.display = "none";
  } else {
    cardPhoto.style.opacity = "1";
    cardMessage.style.display = "none";
    btnAddCart.style.display = "inline";
    desiredQuantity.style.display = "inline";
  }
};

/**
 * Keep the products that the user want to shop.
 * @param {click} event 
 */
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
      }
      shoppingCart.push(itemCart);
      validateStock(quantity - product.stock, item);
      alert(`${product.name} added succesfully`);
      item.querySelector(".desiredQuantity").value = "";
    } else {
      alert(`In stock ${product.stock} products only`);
    }
  } else {
    if ((productInCart[0].quantity + quantity) <= product.stock) {
      productInCart[0].quantity += quantity;
      alert(`${product.name} added succesfully`);
      validateStock(productInCart[0].quantity - product.stock, item);
    } else {
      alert(`You can add ${(product.stock - productInCart[0].quantity)} items only.`);
    }
  }
  cartCounter.innerText = shoppingCart.length;
  loadCartItems();
};

/**
 * Load cart page information.
 */
function loadCartItems() {
  const cartContainer = document.querySelector(".cart_products");
  const modelProduct = cartContainer.querySelector(".item");
  cartContainer.innerHTML = "";
  sumValues = 0;
  cartContainer.appendChild(modelProduct);

  shoppingCart.forEach(element => {
    const item = modelProduct.cloneNode(true);
    cartContainer.appendChild(item);

    item.querySelector(".item_name").innerText = `${element.product.name}`;
    item.querySelector(".item_quantity").innerText = `${element.quantity}`;
    item.querySelector(".item_unitPrice").innerText = `${element.product.unit_price}`;
    item.querySelector(".item_totalPrice").innerText = `${element.product.unit_price * element.quantity}`;
  })
  calculateOrderValue();
};

/**
 * Calculate the total value of the order.
 */
function calculateOrderValue() {
  const values = document.querySelectorAll(".item_totalPrice");

  values.forEach((element, index) => {
    if (index != 0) {
      sumValues += parseInt(element.innerHTML);
    }
  })
  document.getElementById("OrderValue").innerText = `${sumValues}`;
};

/**
 * Create a JSON file with items list for shop.
 */
function createOrder() {
  const order = {
    "product": shoppingCart,
    "totalOrderValue": sumValues
  }

  createJsonFile(JSON.stringify(order), 'order.json', 'text/json;charset=utf-8');
};

/**
 * Create a Json file.
 * @param {String} content 
 * @param {String} fileName 
 * @param {String} contentType 
 */
function createJsonFile(content, fileName, contentType) {
  const anchor = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  anchor.href = URL.createObjectURL(file);
  anchor.download = fileName;
  anchor.click();
};

window.addEventListener("load", onLoad);
btnOrder.addEventListener("click", createOrder);