const express = require("express");
const {
  registerController,
  loginController,
  forgotPasswordController,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forget-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

module.exports = router;
