const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const mongoStore = require("connect-mongo");
const userModel = require("./DB/usuariosModel");
const bcrypt = require("bcrypt");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded(false));

app.use(
  session({
    store: mongoStore.create({
      mongoUrl: require("./config").mongodb.cnxStr,
    }),
    secret: require("./config").sessionSecret,
    saveUninitialized: true,
    resave: true,
  })
);

function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  "local-login",
  new LocalStrategy((username, password, done) => {
    userModel.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        console.log(`User not found`);
        return done(null, false);
      }
      if (!isValidPassword(user, password)) {
        console.log(`Invalid password`);
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      userModel.findOne({ username: username }, (err, user) => {
        if (err) {
          console.log(`Error in signup ${err}`);
        }
        if (user) {
          console.log(`User already exists`);
          return done(null, false);
        }
        const newUser = {
          username: username,
          password: bcrypt.hashSync(password, 10),
          nombre: req.body.nombre,
          apellido: req.body.apellido,
          direccion: req.body.direccion,
          edad: req.body.edad,
          telefono: req.body.telefono,
          foto: req.body.foto,
        };

        userModel.create(newUser, (err, user) => {
          if (err) {
            console.log(`Error in saving user: ${err}`);
            return done(err);
          }
          return done(null, user);
        });
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id, done);
});

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
