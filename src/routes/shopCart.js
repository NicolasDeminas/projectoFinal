const express = require("express");
const { validateToken } = require("../config/auth");
const { warningLogger } = require("../config/loggers");

const { Router } = express;

const router = new Router();

const product = require("../daos/index").productoDao;
const cart = require("../daos/index").carritoDao;

// const Cart = require("../containers/carts");
// const cart = new Cart();
// const Product = require("../containers/product");
// const product = new Product();

// router.get("/", validateToken, (req, res) => {
//   console.log(req.user.carrito._id);
//   res.send(req.user);
// });

router.post("/", validateToken, async (req, res) => {
  try {
    await cart.save(req.body);
    res.send(`Carrito creado existosamente`);
  } catch (err) {
    warningLogger.error(err);
  }
});

router.delete("/:id", validateToken, async (req, res) => {
  try {
    await cart.delete(req.params.id);
    res.send(`Carrito ${req.params.id} borrado`);
  } catch (err) {
    warningLogger.error(err);
  }
});

router.get("/", validateToken, async (req, res) => {
  try {
    res.send(await cart.getAll());
  } catch (err) {
    warningLogger.error(err);
  }
});

router.get("/:id", validateToken, async (req, res) => {
  try {
    let carrito = await cart.getById(req.params.id);
    await carrito.populate("product");
    res.send(await cart.getById(req.params.id));
  } catch (err) {
    warningLogger.error(err);
  }
});

router.post("/:id/productos", validateToken, async (req, res) => {
  try {
    let { product } = req.body;

    if (!product) {
      return res.json({ err: `Producto incorrecto` });
    }
    let products = await cart.getProducts(req.params.id);
    products.push(product);
    await cart.update(req.params.id, products);

    res.json({ msg: `Producto agregado con exito` });
  } catch (err) {
    warningLogger.error(err);
  }
});

router.get("/:id/productos", validateToken, async (req, res) => {
  try {
    res.send(await cart.getProducts(req.params.id));
  } catch (err) {
    warningLogger.error(err);
  }
});

router.delete("/:id/productos/:idProd", validateToken, async (req, res) => {
  try {
    await cart.deleteProduct(req.params.id, req.params.idProd);
    res.send("Producto eliminado del carrito");
  } catch (err) {
    warningLogger.error(err);
  }
});

const transporter = require("../config/mailer");
const client = require("../config/whatsapp");
const dotenv = require("dotenv");
dotenv.config();

const TEST_MAIL = process.env.MAIL;

router.get("/comprar/:id", validateToken, async (req, res) => {
  let products = await cart.getById(req.params.id);
  await products.populate({
    path: "product",
    model: "Product",
  });
  if (!products.product) {
    res.json({ err: `Carrito vacio` });
  }

  try {
    let info = await transporter.sendMail({
      from: "Servidor node.js",
      to: TEST_MAIL,
      subject: "Nueva compra",
      html: `<h1> Pedido </h1>  ${products.product.map((pr) => {
        `
        Articulo: ${pr.nombre} \n
        Precio: ${pr.precio} \n
        Codigo: ${pr.codigo} \n
        `;
      })}`,
    });

    let whatsapp = await client.messages.create({
      body: `<h1> Pedido </h1>  ${products.product.map((pr) => {
        `
        Articulo: ${pr.nombre} \n
        Precio: ${pr.precio} \n
        Codigo: ${pr.codigo} \n
        `;
      })}`,
      from: "whatsapp:+14155238886",
      to: "whatsapp:+5493412007979",
    });
    //console.log(products.product.length);
    for (let i = 0; i < products.product.length; i++) {
      let res = await cart.deleteProduct(
        req.params.id,
        JSON.stringify(products.product[i]._id)
      );
    }
  } catch (err) {
    warningLogger.error(err);
  }

  res.json({ products: products.product });
});

module.exports = router;
