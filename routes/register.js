const express = require("express");
const bcrypt = require('bcrypt');
const { validateRegister, validateLogin } = require("../middlewares/validation");
const User = require("../models/user");

const router = express.Router();

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
    // hash password
    const salt = bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        res.status(400).send("failed hash password")
      }
    })
    const hashedConfirmPassword = bcrypt.hash(passwordConfirm, salt, (err, hash) => {
      if (err) {
        res.status(400).send("failed hash password")
      }
    })

    const savedUser = new User({
      name,
      email,
      hashedPassword,
      hashedConfirmPassword,
    });

    await savedUser.save();
    res.send(savedUser);
  } catch (error) {
    res.status(400).json({ err: `bad request register : ${error}` });
  }
});

module.exports = router;
