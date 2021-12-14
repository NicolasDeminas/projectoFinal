const Mongo = require("../../containers/mongo");

class ProductDaoMongo extends Mongo {
  constructor() {
    super("Product", {
      nombre: {
        type: String,
        required: true,
      },
      descripcion: {
        type: String,
        required: true,
      },
      codigo: {
        type: String,
        required: true,
      },
      foto: {
        type: String,
        required: true,
      },
      precio: {
        type: Number,
        default: 0,
        required: true,
      },
      stock: {
        type: Number,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    });
  }
}

module.exports = ProductDaoMongo;
