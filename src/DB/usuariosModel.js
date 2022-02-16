const { Schema, model } = require("mongoose");

const usuarioSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  foto: {
    type: String,
    required: true,
  },
});

const userModel = model("Usuarios", usuarioSchema);

module.exports = userModel;
