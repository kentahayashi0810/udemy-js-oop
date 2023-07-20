class Product {
  // title = "DEFAULT";
  // imageUrl;
  // price;
  // description;

  constructor(title, image, price, desc) {
    this.title = title;
    this.imageUrl = image;
    this.price = price;
    this.description = desc;
  }
}

class ElementAttribute {
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

class Component {
  constructor(renderHookId) {
    this.hookId = renderHookId;
  }
  createRootElement(tag, classNames, attributes) {
    const rootElement = document.createElement(tag);
    if (classNames) {
      rootElement.className = classNames;
    }
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        rootElement.setAttribute(attr.name, attr.value);
      }
    }

    if (this.hookId) {
      document.getElementById(this.hookId).append(rootElement);
    }
    return rootElement;
  }
}

class ShoppingCart extends Component {
  constructor(hookId) {
    super(hookId);
  }
  items = [];

  set cartItems(value) {
    this.items = value;
    this.totalOutput.innerHTML = `<h2>Total:\$ ${this.totalAmount.toFixed(
      2
    )}</h2>`;
  }

  get totalAmount() {
    const sum = this.items.reduce((prevValue, curItem) => {
      return prevValue + curItem.price;
    }, 0);
    return sum;
  }

  addProduct(product) {
    const updatedItems = [...this.items, product];
    // this.items.push(product);
    this.cartItems = updatedItems;
  }

  render() {
    const cartEl = this.createRootElement("section", "cart");
    // const cartEl = document.createElement("section");
    cartEl.innerHTML = `
      <h2>Total:\$ ${0}</h2>
      <button>Order Now!</button>
    `;
    // cartEl.className = "cart";
    this.totalOutput = cartEl.querySelector("h2");
    // return cartEl;
  }
}

class ProductItem extends Component {
  constructor(product) {
    super();
    this.product = product;
  }

  addToCart() {
    App.addProductToCart(this.product);
  }

  render() {
    const prodEl = this.createRootElement("li", "product-item");
    // const prodEl = document.createElement("li");
    // prodEl.className = "product-item";
    prodEl.innerHTML = `
      <div>
        <img src="${this.product.imageUrl}" alt="${this.product.title}" >
        <div class="product-item__content">
          <h2>${this.product.title}</h2>
          <h3>\$${this.product.price}</h3>
          <p>${this.product.description}</p>
          <button>Add to Cart</button>
        </div>
      </div>
      `;
    const addCartButton = prodEl.querySelector("button");
    addCartButton.addEventListener("click", this.addToCart.bind(this));
    return prodEl;
  }
}

class ProductList extends Component {
  constructor(hookId) {
    super(hookId);
  }

  products = [
    new Product(
      "A Pillow",
      "https://images.unsplash.com/photo-1629949009710-2df14c41a72e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2680&q=80",
      19.99,
      "A soft Pillow!"
    ),
    new Product(
      "A Carpet",
      "https://images.unsplash.com/photo-1534889156217-d643df14f14a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2728&q=80",
      89.99,
      "A great Carpet!"
    ),
  ];

  render() {
    const prodList = this.createRootElement("ul", "product-list");
    // const prodList = document.createElement("ul");
    // prodList.className = "product-list";

    for (const prod of this.products) {
      const productItem = new ProductItem(prod);
      const prodEl = productItem.render();
      prodList.append(prodEl);
    }
    // return prodList;
  }
}

class Shop {
  render() {
    // const renderHook = document.getElementById("app");

    this.cart = new ShoppingCart("app");
    this.cart.render();
    const productList = new ProductList("app");
    productList.render();
    // renderHook.append(cartEl);
    // renderHook.append(prodListEl);
  }
}

class App {
  static cart;

  static init() {
    const shop = new Shop();
    shop.render();
    this.cart = shop.cart;
  }

  static addProductToCart(product) {
    this.cart.addProduct(product);
  }
}
App.init();
