const cart = require("../daos/index").carritoDao;
const { warningLogger } = require("../config/loggers");
const transporter = require("../config/mailer");
const client = require("../config/whatsapp");
const dotenv = require("dotenv");
// const { addCarrito } = require("../controllers/carritoController");
dotenv.config();

const TEST_MAIL = process.env.MAIL;

const addCarrito = async (req, res) => {
    try {
      await cart.save(req.body);
      res.send(`Carrito creado existosamente`);
    } catch (err) {
      warningLogger.error(err);
    }
  }

const deleteCarrito = async (req, res) => {
    try {
      await cart.delete(req.params.id);
      res.send(`Carrito ${req.params.id} borrado`);
    } catch (err) {
      warningLogger.error(err);
    }
  }

const getAll = async (req, res) => {
    try {
      res.send(await cart.getAll());
    } catch (err) {
      warningLogger.error(err);
    }
  }

const getById = async (req, res) => {
    try {
      let carrito = await cart.getById(req.params.id);
      await carrito.populate("product");
      res.send(await cart.getById(req.params.id));
    } catch (err) {
      warningLogger.error(err);
    }
  }

const addProductToCart = async (req, res) => {
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
}

const getProductsFromCart = async (req, res) => {
  try {
    res.send(await cart.getProducts(req.params.id));
  } catch (err) {
    warningLogger.error(err);
  }
}

const deleteProductFromCart = async (req, res) => {
  try {
    await cart.deleteProduct(req.params.id, req.params.idProd);
    res.send("Producto eliminado del carrito");
  } catch (err) {
    warningLogger.error(err);
  }
}

const comprar = async (req, res) => {
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
}

module.exports = {
    addCarrito,
    deleteCarrito,
    getAll,
    getById,
    addProductToCart,
    getProductsFromCart,
    deleteProductFromCart,
    comprar
}