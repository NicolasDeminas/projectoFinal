const fs = require("fs");

const Product = require("./product");
const product = new Product();

const writeCartFile = async (arr) => {
  await fs.promises.writeFile(
    "./src/DB/carritos.txt",
    JSON.stringify(arr, null, 2),
    {
      encoding: "utf-8",
    }
  );
};

const readCartFile = async () => {
  let file = await fs.promises.readFile("./src/DB/carritos.txt", {
    encoding: "utf-8",
  });
  return file;
};

const today = new Date(Date.now());

class Contenedor {
  constructor() {
    this.cart = [];
  }

  async save(cart) {
    let fileExits = await readCartFile(); //String
    if (fileExits && fileExits.length >= 0) {
      let dataFile = JSON.parse(fileExits);
      cart.id = dataFile.length + 1;
      cart.timeStamp = today;
      cart.producto = [];
      dataFile.push(cart);
      this.cart = dataFile;
      writeCartFile(this.cart);
      console.log(`Carrito guardado con id:${cart.id}`);
    } else {
      cart.id = 1;
      cart.timeStamp = today;
      cart.producto = [];
      this.cart.push(cart);
      writeCartFile(this.cart);
    }
  }

  async getById(id) {
    let fileExists = await readCartFile();
    if (fileExists && fileExists.length >= 0) {
      let fileData = JSON.parse(fileExists);
      let pos;
      fileData.find((el, index, array) => {
        if (el.id == id) {
          pos = index;
          return pos;
        }
      });

      return fileData[pos];
    }
  }
  async getAll() {
    let fileExists = await readCartFile();
    if (fileExists && fileExists.length >= 0) {
      let fileData = JSON.parse(fileExists);
      //console.log(fileData.length);
      return fileData;
    }
  }

  async getProducts(id) {
    let fileExists = await readCartFile();
    if (fileExists && fileExists.length >= 0) {
      let fileData = JSON.parse(fileExists);
      let pos;
      fileData.find((el, index, array) => {
        if (el.id == id) {
          pos = index;
          return pos;
        }
      });
      return fileData[pos].producto;
    }
  }

  async update(id, arr) {
    let fileExists = await readCartFile();
    if (fileExists && fileExists.length >= 0) {
      let fileData = JSON.parse(fileExists);
      let pos;
      fileData.find((el, index, array) => {
        if (el.id == id) {
          pos = index;
          return pos;
        }
      });
      let pr = await product.getById(arr.id);
      fileData[pos].producto.push(pr);
      writeCartFile(fileData);
      return fileData;
    }
  }

  async delete(id) {
    let fileExists = await readCartFile();
    if (fileExists && fileExists.length >= 0) {
      let fileData = JSON.parse(fileExists);
      let arr = [];
      fileData.filter((x) => {
        if (x.id != id) {
          arr.push(x);
        }
        writeCartFile(arr);
      });
    }
  }

  async deleteProduct(id, idProduct) {
    let fileExists = await readCartFile();
    if (fileExists && fileExists.length >= 0) {
      let fileData = JSON.parse(fileExists);
      let pos;
      fileData.find((el, index, array) => {
        if (el.id == id) {
          pos = index;
          return pos;
        }
      });
      let pr;
      fileData[pos].producto.filter((el, index) => {
        if (el.id == idProduct) {
          pr = index;
        }
      });
      fileData[pos].producto.splice(pr, 1);
      //console.log(fileData[pos]);
      //console.log(fileData);
      writeCartFile(fileData);
      return fileData;
    }
  }
}

module.exports = Contenedor;
