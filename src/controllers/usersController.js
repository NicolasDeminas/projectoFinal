const users = require("../daos/index").usuarioDao;
const bcrypt = require("bcrypt");
const cart = require("../daos/index").carritoDao;
const { generateToken } = require("../config/auth");
const transporter = require("../config/mailer");
const { warningLogger } = require("../config/loggers");
const dotenv = require("dotenv");
dotenv.config();

const TEST_MAIL = process.env.MAIL;

function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

const signup = async (req, res) => {
  const foto = `${req.file.destination}/${req.file.filename}`;
  const { username, password, nombre, apellido, direccion, edad, telefono } =
    req.body;

  const usuarios = await users.getAll();

  usuarios.filter((user) => {
    if (user.username == username) {
      return res.json({ msg: `Nombre de usuario invalido` });
    }
  });

  const user = {
    username: username,
    password: bcrypt.hashSync(password, 10),
    nombre: nombre,
    apellido: apellido,
    direccion: direccion,
    edad: edad,
    telefono: telefono,
    foto: foto,
  };

  try {
    await users.save(user);
    let info = await transporter.sendMail({
      from: "Servidor node.js",
      to: TEST_MAIL,
      subject: "Nuevo registro",
      html: `<h1> Nuevo usuario registrado </h1> \n 
      <span>Nombre: ${nombre} </span>\n  
      <span>Apellido: ${apellido} </span>\n 
      <span>Direccion: ${direccion} </span>\n 
      <span>Telefono: ${telefono}</span>`,
    });
  } catch (err) {
    warningLogger.error(err);
  }

  res.json({ msg: `Usuario agregado con exito` });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  let usuario;

  const usuarios = await users.getAll();

  usuarios.find((user) => {
    if (user.username == username) {
      usuario = user;
      return usuario;
    }
  });

  if (!usuario?.username == username) {
    return res.json({ msg: `Usuario o contraseña incorrecta` });
  }

  if (!isValidPassword(usuario, password)) {
    return res.json({ msg: `Usuario o contraseña incorrecta` });
  }

  if (!usuario.carrito) {
    await cart.save();
    let carrito = await cart.getAll();

    usuario.carrito = carrito[carrito.length - 1]._id;

    await users.update(usuario._id, usuario);
  }

  await usuario.populate("carrito");

  const token = generateToken(usuario);

  res.json({ data: `Usuario logueado`, token: token });
};

module.exports = {
  signup,
  login,
};
