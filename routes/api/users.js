const express = require("express");
const router = express.Router();
const User = require("../../models/UserModel");
const requireAuth = require("../../middleware/requireAuth");

router.delete("/", (req, res) => {
  const pass = req.query.pass;
  if (pass == "deleteall012") {
    User.deleteMany({})
      .then(() => res.json({ msg: "All Users Removed" }))
      .catch((err) => res.status(400).json({ error: err }));
  } else {
    return res.status(400).json({ msg: "Unauthorized Request" });
  }
});

router.get("/:id", async (req, res) => {
  await User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json({ msg: "User Not Found" }));
});
router.use(requireAuth);

router.get("/", (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json({ error: err }));
});

module.exports = router;
