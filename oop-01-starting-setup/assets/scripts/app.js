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
  constructor(renderHookId, shouldRender = true) {
    this.hookId = renderHookId;
    if (shouldRender) {
      this.render();
    }
  }

  render() {}

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
    super(hookId, false);
    this.orderProducts = () => {
      console.log("Ordering products...");
      console.log(this.items);
    };
    this.render();
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

    const orderButton = cartEl.querySelector("button");
    orderButton.addEventListener("click", this.orderProducts);
    this.totalOutput = cartEl.querySelector("h2");
  }
}

class ProductItem extends Component {
  constructor(product, hookId) {
    super(hookId, false);
    this.product = product;
    this.render();
  }

  addToCart() {
    App.addProductToCart(this.product);
  }

  render() {
    const prodEl = this.createRootElement("li", "product-item");
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
    document.getElementById(this.hookId).append(prodEl);
  }
}

class ProductList extends Component {
  #products = [];

  constructor(hookId) {
    super(hookId, false);
    this.render();
    this.fetchProduct();
  }

  fetchProduct() {
    this.#products = [
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
      new Product(
        "An abondanded house",
        "https://images.unsplash.com/photo-1566754844421-9bc834baf4a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
        19000,
        "A great house!"
      ),
    ];

    this.renderProducts();
  }

  renderProducts() {
    for (const prod of this.#products) {
      const productItem = new ProductItem(prod, "prod-list");
    }
  }

  render() {
    this.createRootElement("ul", "product-list", [
      new ElementAttribute("id", "prod-list"),
    ]);
    if (this.#products && this.#products.length > 0) {
      this.renderProducts();
    }
  }
}

class Shop {
  constructor() {
    this.render();
  }

  render() {
    this.cart = new ShoppingCart("app");
    new ProductList("app");
  }
}

class App {
  static cart;

  static init() {
    const shop = new Shop();
    this.cart = shop.cart;
  }

  static addProductToCart(product) {
    this.cart.addProduct(product);
  }
}
App.init();
