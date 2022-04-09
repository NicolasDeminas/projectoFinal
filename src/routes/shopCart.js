const express = require("express");
const { validateToken } = require("../config/auth");
const { warningLogger } = require("../config/loggers");
const {addCarrito, deleteCarrito, getAll, getById, addProductToCart, getProductsFromCart, deleteProductFromCart, comprar} = require('../controllers/carritoController')

const { Router } = express;

const router = new Router();

const cart = require("../daos/index").carritoDao;

// const Cart = require("../containers/carts");
// const cart = new Cart();
// const Product = require("../containers/product");
// const product = new Product();

// router.get("/", validateToken, (req, res) => {
//   console.log(req.user.carrito._id);
//   res.send(req.user);
// });

router.post("/", validateToken, addCarrito);

router.delete("/:id", validateToken, deleteCarrito);

router.get("/", validateToken, getAll);

router.get("/:id", validateToken, getById);

router.post("/:id/productos", validateToken, addProductToCart);

router.get("/:id/productos", validateToken, getProductsFromCart);

router.delete("/:id/productos/:idProd", validateToken, deleteProductFromCart);

router.get("/comprar/:id", validateToken, comprar);

module.exports = router;
