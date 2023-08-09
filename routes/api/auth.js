const express = require("express");
const router = express.Router();
const { signupUser, loginUser } = require("../../controllers/AuthControllers");

router.get("/signup", (req, res) => {
  res.json({ msg: "sign up route" });
});

router.post("/signup", signupUser);

router.get("/login", (req, res) => {
  res.json({ msg: "login route" });
});

router.post("/login", loginUser);

module.exports = router;
