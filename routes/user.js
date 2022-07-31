const express = require("express");
const {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  logoutController,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/logout", logoutController);
router.post("/forget-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);

module.exports = router;
