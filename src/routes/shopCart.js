const express = require("express");

const { Router } = express;

const router = new Router();

const product = require("../daos/index").productoDao;
const cart = require("../daos/index").carritoDao;

// const Cart = require("../containers/carts");
// const cart = new Cart();
// const Product = require("../containers/product");
// const product = new Product();

router.post("/", async (req, res) => {
  await cart.save(req.body);
  res.send(`Carrito creado existosamente`);
});

router.delete("/:id", async (req, res) => {
  await cart.delete(req.params.id);
  res.send(`Carrito ${req.params.id} borrado`);
});

router.get("/", async (req, res) => {
  res.send(await cart.getAll());
});

router.get("/:id", async (req, res) => {
  res.send(await cart.getById(req.params.id));
});

router.post("/:id/productos", async (req, res) => {
  const carrito = await cart.getById(req.params.id);
  const producto = await await product.getById(req.body.id);
  //console.log(carrito);
  //console.log(producto);
  carrito.product.push(producto);
  //console.log(carrito);
  await cart.update(carrito);
  res.send("Producto agregado al carrito");
});

router.get("/:id/productos", async (req, res) => {
  res.send(await cart.getProducts(req.params.id));
});

router.delete("/:id/productos/:idProd", async (req, res) => {
  await cart.deleteProduct(req.params.id, req.params.idProd);
  res.send("Producto eliminado del carrito");
});

module.exports = router;
