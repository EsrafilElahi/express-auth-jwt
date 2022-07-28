const {
  validateRegister,
  validateLogin,
} = require("../middlewares/validation");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  // check validator
  const error = validateRegister(req.body);
  if (error) {
    res.status(400).send("validation error!");
  }

  // check user exist
  const existUser = await User.findOne({ email: req.body.email });
  if (existUser) {
    res.status(400).send("Email Already Exist!");
  }

  try {
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const hashedConfirmPassword = await bcrypt.hash(
      req.body.passwordConfirm,
      salt
    );

    const savedUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      passwordConfirm: hashedConfirmPassword,
    });

    await savedUser.save();
    // jwt create and sign token
    const token = jwt.sign({ _id: savedUser._id }, process.env.SECRET_KEY);
    res.header("Auth-Token", token);
    res.status(201).json({ token: token, user: savedUser });
  } catch (error) {
    res.status(400).send("create user error " + error);
  }
};

const loginController = async (req, res) => {
  // validator
  const error = validateLogin(req.body);
  if (error) {
    res.status(400).send("validator error");
  }
  // check user exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).send("user not found please sign in first!");
  }
  // check password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  console.log("user.password :", user.password);
  if (!validPassword) {
    res.status(400).send("email or password is wrong!");
  }

  try {
    // create and sign token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
    res.header("Auth-Token", token);
    res.status(200).json({ token: token, msg: "you logged in" });
  } catch (error) {
    res.status(400).send("err in login " + error);
  }
};

module.exports = { registerController, loginController };