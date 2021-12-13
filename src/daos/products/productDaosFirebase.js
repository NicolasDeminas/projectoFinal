const Firebase = require("../../containers/firebaseProduct");

class ProductDaoFirebase extends Firebase {
  constructor() {
    super("Productos");
  }
}

module.exports = ProductDaoFirebase;
