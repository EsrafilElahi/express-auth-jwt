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
      role: req.body.role,
      courses: req.body.courses,
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

const forgotPasswordController = async (req, res) => {
  // check user exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).send("user not found!");
  }

  try {
    // create and sign token to user
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    const link = `http://localhost:${process.env.PROJECT_PORT}/users/forget-password/${token}`;

    res.status(201).json({
      resetPasswordLink: link,
      msg: "rest password link is sent successfully",
    });
  } catch (error) {
    res.status(400).send("failed jwt sign " + error);
  }
};

const resetPasswordController = async (req, res) => {
  const token = req.params.token;

  // verify token and check it
  const tokenUserId = jwt.verify(token, process.env.SECRET_KEY);
  if (!tokenUserId) {
    res.status(401).send("un authorized!");
  }

  // check password with passwordConfirm
  if (req.body.password !== req.body.passwordConfirm) {
    res.status(422).send("two passwords are not same!");
  }

  try {
    const user = await User.findOne({ _id: tokenUserId });
    if (!user) {
      res.status(404).send("user not found!");
    }
    user.password = req.body.password;
    await user.save();
    res.status(200).send("password has been changed");
  } catch (error) {
    res.status(400).send("reset password is failed");
  }
};

const logoutController = async (req, res) => {
  // const authHeader = req.headers["authorization"];
  // const token = authHeader.split(" ")[1];
  const token = req.header("Auth-Token");
  if (token) {
    res.status(401).send("not authorization!");
  }

  jwt.sign(token, "", { expiresIn: 1 }, (logout, err) => {
    if (err) {
      res.status(401).send("not logout");
    }
    res.status(200).send("logged out!");
  });
};

module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  logoutController,
};
