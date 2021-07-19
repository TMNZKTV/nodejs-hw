const express = require("express");
const router = new express.Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
// const jimp = require("jimp");
const TMP_DIR = path.resolve("./tmp");
const FILE_DIR = path.join("public", "avatars");

const {
  signupController,
  loginController,
  logoutController,
  getCurrentUserController,
  updateUserAvatarController,
} = require("../../src/controllers/authControllers");

const { authMiddleware } = require("../../src/middlewares/authMiddleware");

const { authValidation } = require("../../src/middlewares/validators");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TMP_DIR);
  },
  filename: (req, file, cb) => {
    const [filename, extension] = file.originalname.split(".");
    cb(null, `${uuidv4()}.${extension}`);
  },
});

const multerMiddleware = multer({ storage });

router.post("/signup", authValidation, signupController);
router.post("/login", authValidation, loginController);
router.post("/logout", authMiddleware, logoutController);
router.get("/current", authMiddleware, getCurrentUserController);

router.use("/", express.static(FILE_DIR));
router.patch(
  "/avatars",
  multerMiddleware.single("avatar"),
  updateUserAvatarController
);

module.exports = {
  authRouter: router,
};
