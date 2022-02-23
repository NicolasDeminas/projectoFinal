const { Schema } = require("mongoose");
const Mongo = require("../../containers/mongo");

class CarritoDaoMongo extends Mongo {
  constructor() {
    super("Cart", {
      timestamp: {
        type: Date,
        default: Date.now,
      },
      product: [
        {
          type: Schema.ObjectId,
          ref: "Product",
        },
      ],
    });
  }

  async save(carrito) {
    return super.save(carrito);
  }

  async update(carrito, producto) {
    const products = await this.coleccion.findOneAndUpdate(
      { _id: carrito },
      { product: producto }
    );
    return products;
  }

  async getById(id) {
    let carrito = await this.coleccion.findById({ _id: id });
    return carrito;
  }

  async getProducts(id) {
    const carrito = await this.getById(id);
    return carrito.product;
  }

  async deleteProduct(id, idProduct) {
    const carrito = await this.getById(id);
    const index = carrito.product.findIndex(
      (pr) => JSON.stringify(pr._id) == idProduct
    );
    //console.log(index);
    if (index != -1) {
      carrito.product.splice(index, 1);
      //console.log(carrito);
      this.update(id, carrito);
    }
    //console.log(carrito.product);
    return carrito;
  }
}

module.exports = CarritoDaoMongo;
