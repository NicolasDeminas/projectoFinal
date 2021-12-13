const mongoose = require("mongoose");
const config = require("../config");

mongoose.connect(config.mongodb.cnxStr);

class Contenedor {
  constructor(colection, schema) {
    this.coleccion = mongoose.model(colection, schema);
  }

  async save(obj) {
    await this.coleccion.create(obj);
  }

  async getById(id) {
    const products = await this.coleccion.findById(id);
    return products;
  }

  async getAll() {
    const products = await this.coleccion.find();
    return products;
  }

  async update(id, obj) {
    const products = await this.coleccion.findOneAndUpdate({ _id: id }, obj);
    return products;
  }

  async delete(id) {
    await this.coleccion.deleteOne({ _id: id });
  }
}

module.exports = Contenedor;
