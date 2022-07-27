const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/", (req, res) => {
  const { name, email, password } = req.body;

  // check user exists
  // const existUser = User.findOne({ email: email });
  // console.log("existUser :", existUser);
  // if (existUser) {
  //   res.status(400).send("Email Already Exist");
  // }

  try {
    const savedUser = new User({
      name,
      email,
      password,
    });
    savedUser.save();
    res.send(savedUser);
  } catch (error) {
    res.status(400).json({ err: `error in 400 : ${error}` });
  }
});

module.exports = router;
