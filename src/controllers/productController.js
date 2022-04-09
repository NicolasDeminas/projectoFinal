const product = require("../daos/index").productoDao;
const { warningLogger } = require("../config/loggers");

const getAll = async (req, res) => {
  try {
    res.json(await product.getAll());
  } catch (err) {
    warningLogger.error(err);
  }
};

const getById = async (req, res) => {
  try {
    res.json(await product.getById(req.params.id));
  } catch (err) {
    warningLogger.error(err);
  }
};

const addProduct = async (req, res) => {
  try {
    let newProduct = await product.save(req.body);
    res.json({ msg: `Producto agregado` });
  } catch (err) {
    warningLogger.error(err);
  }
}

const updateProduct = async (req, res) => {
  try {
    await product.update(req.params.id, req.body);
    res.send("Producto actualizado con exito");
  } catch (err) {
    warningLogger.error(err);
  }
}

const deleteProduct = async (req, res) => {
  try {
    await product.delete(req.params.id);
    res.send("Producto eliminado con exito");
    return;
  } catch (err) {
    warningLogger.error(err);
  }
}

module.exports = {
  getAll,
  getById,
  addProduct,
  updateProduct,
  deleteProduct
};
