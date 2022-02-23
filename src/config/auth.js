const dotenv = require("dotenv");
dotenv.config();

const users = require("../daos/index").usuarioDao;

const jwt = require("jsonwebtoken");
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const generateToken = (user) => {
  const token = jwt.sign({ data: user }, PRIVATE_KEY, { expiresIn: "24h" });
  return token;
};

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "no estas autenticado" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "no estas autorizado" });
    }
    req.user = decoded.data;
    next();
  });
};

const validateAdmin = async (req, res, next) => {
  const { role } = req.user;
  if (role == "Admin") {
    return next();
  }
  res.json({ msg: `Usuario sin privilegios` });
};

module.exports = {
  generateToken,
  validateToken,
  validateAdmin,
};
