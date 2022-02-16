const express = require("express");
const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const { createHash } = require("crypto");

const { Router } = express;

const router = new Router();

router.post("/signup", (req, res) => {
  res.json({ data: req.originalUrl });
});

router.post("/login", (req, res) => {
  res.json({ data: req.originalUrl });
});

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/api/usuarios/login",
    failureRedirect: "/api/usuarios/signup",
  })
);

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.get("/logout", (req, res) => {
  try {
    req.logOut();
    res.redirect("/login");
  } catch (err) {
    errorLogger.error(err);
  }
});

router.get("/", (req, res) => {
  res.json({ data: "Hola mundo" });
});

module.exports = router;
