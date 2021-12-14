const Firebase = require("../../containers/firebase");

class ProductDaoFirebase extends Firebase {
  constructor() {
    super("Productos");
  }
}

module.exports = ProductDaoFirebase;
