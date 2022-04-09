const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const { infoLogger, warningLogger } = require("./config/loggers");

const app = express();
const port = process.env.PORT


const clusterMode = process.env.MODE == "CLUSTER";

if (clusterMode && cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", () => {
    infoLogger.info(`Process ${process.pid} died`);
  });
} else {
  app.use(express.json());
  app.use(express.urlencoded(false));

  const whitelist = ["https://localhost:3000"];

  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  //app.use(cors(corsOptions));
  app.use(cors());

  const products = require("./routes/products");
  const cart = require("./routes/shopCart");
  const user = require("./routes/users");

  app.use("/api/productos", products);
  app.use("/api/carrito", cart);
  app.use("/api/usuarios", user);

  app.use(function (req, res, next) {
    res.status(404).send({
      error: -2,
      descripcion: `Ruta ${req.url}, metodo ${req.method} no implementada`,
    });
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
