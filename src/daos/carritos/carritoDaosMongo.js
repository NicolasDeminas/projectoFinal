const Mongo = require("../../containers/mongoProduct");

class CarritoDaoMongo extends Mongo {
  constructor() {
    super("Cart", {
      timestamp: {
        type: Date,
        default: Date.now,
      },
      product: {
        type: [],
        required: true,
      },
    });
  }

  async save(carrito = { product: [] }) {
    return super.save(carrito);
  }

  async getProduct() {}

  async deleteProduct() {}
}

module.exports = CarritoDaoMongo;
