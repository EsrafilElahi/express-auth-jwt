const express = require("express");
const { validateRegister, validateLogin } = require("../middlewares/validation");
const User = require("../models/user");
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  // check validator
  const error = validateRegister(req.body);
  if (error) {
    res.status(400).send("two passwords are not same!");
  }

  // check user exists
  const existUser = await User.findOne({ email: email });
  if (existUser) {
    res.status(400).send("Email Already Exist!");
  }

  try {
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    const hashedConfirmPassword = await bcrypt.hash(passwordConfirm, salt)

    const savedUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      passwordConfirm: hashedConfirmPassword,
    });

    await savedUser.save();
    res.status(201).send(savedUser);

  } catch (error) {
    res.status(400).send("register user error " + error)
  }


});

module.exports = router;
