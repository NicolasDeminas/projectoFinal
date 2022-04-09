const express = require("express");
const { validateToken, validateAdmin } = require("../config/auth");
const { getAll, getById, addProduct, updateProduct, deleteProduct } = require("../controllers/productController");

const { Router } = express;

const router = new Router();

router.get("/", validateToken, getAll);

router.get("/:id", validateToken, getById);

router.post("/", validateToken, validateAdmin, addProduct);

router.put("/:id", validateToken, validateAdmin, updateProduct);

router.delete("/:id", validateToken, validateAdmin, deleteProduct);

module.exports = router;
