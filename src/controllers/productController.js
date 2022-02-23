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

module.exports = {
  getAll,
  getById,
};
