const express = require("express");

const { Router } = express;

const administrador = false;
const msjError = {
  error: -1,
  mensaje: "usuario sin privilegios",
};
const verificarAutorizacion = (res) => {
  if (!administrador) {
    res.send(msjError);
  }
};

const router = new Router();
const Product = require("../containers/product");
const product = new Product();

router.get("/:id", async (req, res) => {
  res.send(await product.getById(req.params.id));
});

router.post("/", async (req, res) => {
  if (req.query.admin === "true") {
    await product.save(req.body);
    res.send("Producto guardado correctamente");
  }
  verificarAutorizacion(res);
});

router.put("/:id", async (req, res) => {
  if (req.query.admin === "true") {
    console.log(req.params.id);
    console.log(req.body);
    await product.update(req.params.id, req.body);
    res.send("Producto actualizado con exito");
  }
  verificarAutorizacion(res);
});

router.delete("/:id", async (req, res) => {
  if (req.query.admin === "true") {
    await product.delete(req.params.id);
    res.send("Producto eliminado con exito");
  }
  verificarAutorizacion(res);
});

module.exports = router;
