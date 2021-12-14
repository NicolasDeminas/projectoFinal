const Mongo = require("../../containers/mongo");

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

  async update(obj) {
    const products = await this.coleccion.findOneAndUpdate(
      { _id: obj._id },
      { product: obj.product }
    );
    return products;
  }

  async getProducts(id) {
    const carrito = await this.getById(id);
    return carrito.product;
  }

  async deleteProduct(id, idProduct) {
    const carrito = await this.getById(id);
    const index = carrito.product.findIndex((o) => o._id == idProduct);
    if (index != -1) {
      carrito.product.splice(index, 1);
      this.update(carrito);
    }
    //return carrito;
  }
}

module.exports = CarritoDaoMongo;
