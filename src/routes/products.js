const express = require("express");
const { validateToken, validateAdmin } = require("../config/auth");
const { getAll, getById } = require("../controllers/productController");
const { warningLogger } = require("../config/loggers");

const { Router } = express;

const router = new Router();
const product = require("../daos/index").productoDao;

// const product = new Product();

router.get("/", validateToken, getAll);

router.get("/:id", validateToken, getById);

router.post("/", validateToken, validateAdmin, async (req, res) => {
  try {
    let newProduct = await product.save(req.body);
    res.json({ msg: `Producto agregado` });
  } catch (err) {
    warningLogger.error(err);
  }
});

router.put("/:id", validateToken, validateAdmin, async (req, res) => {
  try {
    await product.update(req.params.id, req.body);
    res.send("Producto actualizado con exito");
  } catch (err) {
    warningLogger.error(err);
  }
});

router.delete("/:id", validateToken, validateAdmin, async (req, res) => {
  try {
    await product.delete(req.params.id);
    res.send("Producto eliminado con exito");
    return;
  } catch (err) {
    warningLogger.error(err);
  }
});

module.exports = router;
