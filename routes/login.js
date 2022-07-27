const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", async (req, res) => {
  const allUsers = await User.find({});
  res.send(allUsers);
});

module.exports = router;
