const express = require("express");
const router = express.Router();
const { validateRegister, validateLogin } = require("../middlewares/validation");
const User = require("../models/user");

router.post("/", async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  // check validator
  const error = validateRegister(req.body);
  if (error) {
    res.status(400).send("validate register error");
  }

  // check user exists
  const existUser = await User.findOne({ email: email });
  if (existUser) {
    res.status(400).send("Email Already Exist!");
  }

  try {
    const savedUser = new User({
      name,
      email,
      password,
      passwordConfirm,
    });
    await savedUser.save();
    res.send(savedUser);
  } catch (error) {
    res.status(400).json({ err: `bad request register : ${error}` });
  }
});

module.exports = router;
