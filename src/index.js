const express = require("express");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded(false));

const products = require("./routes/products");
const cart = require("./routes/shopCart");

app.use("/api/productos", products);
app.use("/api/carrito", cart);

app.use(function (req, res, next) {
  res.status(404).send({
    error: -2,
    descripcion: `Ruta ${req.url}, metodo ${req.method} no implementada`,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
