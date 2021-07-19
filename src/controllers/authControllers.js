const path = require("path");
const FILE_DIR = path.join("public", "avatars");

const {
  signup,
  login,
  logout,
  getCurrentUser,
  updateUserAvatar,
} = require("../services/authServices");

const signupController = async (req, res) => {
  try {
    const { password, email, subscription } = req.body;

    const user = await signup(password, email, subscription);

    res.status(201).json({ message: "success", user: { email, subscription } });
  } catch (error) {
    res.status(409).json({ message: `${error.message}` });
  }
};

const loginController = async (req, res) => {
  try {
    const { password, email } = req.body;

    const { token, user } = await login(password, email);

    res.status(200).json({ status: "success", token, user });
  } catch (error) {
    res.json({ message: "Email or password is wrong" });
  }
};

const logoutController = async (req, res) => {
  try {
    const { userId } = req;
    await logout(userId);
    res.status(204);
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};

const getCurrentUserController = async (req, res) => {
  const { authorization } = req.headers;
  const user = await getCurrentUser(authorization);
  res.json({ status: "success", user });
};

const updateUserAvatarController = async (req, res) => {
  const { authorization } = req.headers;

  const { file } = req;

  try {
    const user = await updateUserAvatar(authorization, file);
    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = {
  signupController,
  loginController,
  logoutController,
  getCurrentUserController,
  updateUserAvatarController,
};
