const express = require("express");
const auth = require("../middlewares/auth");

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
const product = require("../daos/index").productoDao;

// const product = new Product();

router.get("/", auth, async (req, res) => {
  res.json(await product.getAll());
});

router.get("/:id", async (req, res) => {
  res.send(await product.getById(req.params.id));
});

router.post("/", auth, async (req, res) => {
  if (req.query.admin === "true") {
    await product.save(req.body);
    res.send("Producto guardado correctamente");
    return;
  }
  // verificarAutorizacion(res);
});

router.put("/:id", async (req, res) => {
  if (req.query.admin === "true") {
    await product.update(req.params.id, req.body);
    res.send("Producto actualizado con exito");
    return;
  }
  verificarAutorizacion(res);
});

router.delete("/:id", async (req, res) => {
  if (req.query.admin === "true") {
    await product.delete(req.params.id);
    res.send("Producto eliminado con exito");
    return;
  }
  verificarAutorizacion(res);
});

module.exports = router;
