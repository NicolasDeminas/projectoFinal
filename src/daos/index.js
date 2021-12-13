let productoDao;
let carritoDao;

const db = "file";

switch (db) {
  case "file":
    const ProductFile = require("./products/productDaosFile");
    const CarritoFile = require("./carritos/carritoDaosFile");
    productoDao = new ProductFile();
    carritoDao = new CarritoFile();
    break;

  case "mongo":
    const ProductMongo = require("./products/productDaosMongo");
    const CarritoMongo = require("./carritos/carritoDaosMongo");
    productoDao = new ProductMongo();
    carritoDao = new CarritoMongo();
    break;

  case "firebase":
    const ProductFirebase = require("./products/productDaosFirebase");
    //const CarritoFirebase = require("./carritos/carritoDaosFirebase");
    productoDao = new ProductFirebase();
    //carritoDao = new CarritoFirebase();
    break;
}

module.exports = { productoDao, carritoDao };
