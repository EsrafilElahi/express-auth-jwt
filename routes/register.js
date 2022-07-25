const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const savedUser = new User({
      name,
      email,
      password,
    });
    res.send(savedUser);
  } catch (error) {
    res.status(400).json({ err: `error : ${error}` });
  }
});

module.exports = router;
