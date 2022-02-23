const express = require("express");
const { signup, login } = require("../controllers/usersController");
const update = require("../middlewares/multerMiddleware");
const { validateToken } = require("../config/auth");

const { Router } = express;

const router = new Router();

router.get("/", validateToken, (req, res) => {
  //console.log(req.user);
  res.json({ response: req.user });
});

router.post("/signup", update.single("foto"), signup);
router.post("/login", login);

module.exports = router;
