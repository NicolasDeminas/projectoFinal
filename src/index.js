const express = require("express");
const cors = require("cors");
const passport = require("./config/passport");
const session = require("express-session");

const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const { infoLogger, warningLogger } = require("./config/loggers");

const mongoStore = require("connect-mongo");

const app = express();
const port = process.env.PORT || 8080;

const dotenv = require("dotenv");
dotenv.config();

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

  app.use(
    session({
      store: mongoStore.create({
        mongoUrl: require("./config/config").mongodb.cnxStr,
      }),
      secret: require("./config/config").sessionSecret,
      saveUninitialized: true,
      resave: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

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
