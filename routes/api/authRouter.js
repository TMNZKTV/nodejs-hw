const express = require("express");
const router = new express.Router();

const {
  signupController,
  loginController,
  logoutController,
  getCurrentUserController,
} = require("../../src/controllers/authControllers");

const { authMiddleware } = require("../../src/middlewares/authMiddleware");

const { authValidation } = require("../../src/middlewares/validators");

router.post("/signup", authValidation, signupController);
router.post("/login", authValidation, loginController);
router.post("/logout", authMiddleware, logoutController);
router.get("/current", authMiddleware, getCurrentUserController);

module.exports = {
  authRouter: router,
};
