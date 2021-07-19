const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { User } = require("../db/userSchema");
const path = require("path");
const fs = require("fs").promises;
const jimp = require("jimp");
const FILE_DIR = path.join("public", "avatars");

const signup = async (password, email, subscription) => {
  const user = new User({
    password,
    email,
    subscription,
  });

  await user.save();
  return user;
};

const login = async (password, email) => {
  const user = await User.findOne({ email });

  const { _id, subscription } = user;

  if (!user || !(await bcrypt.compare(password, user.password))) {
    console.log("No user found. The email or password may be incorrect");
  }

  const token = jsonwebtoken.sign({ _id }, process.env.JWT_SECRET);

  await User.findByIdAndUpdate(_id, { $set: { token } });

  return { token, user: { email, subscription } };
};

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { $set: { token: null } });
};

const getCurrentUser = async (authorization) => {
  const [tokenType, token] = authorization.split(" ");

  const user = await User.findOne({ token }).select({
    _id: 0,
    password: 0,
    __v: 0,
    token: 0,
  });

  if (!user) {
    throw new NotAuthorizedError("Invalid token.");
  }

  return user;
};
const updateUserAvatar = async (authorization, file) => {
  const [tokenType, token] = authorization.split(" ");

  const user = await User.findOne({ token }).select({
    _id: 0,
    password: 0,
    __v: 0,
    token: 0,
  });

  if (!user) {
    throw new NotAuthorizedError("Invalid token.");
  }

  if (file) {
    try {
      const img = await jimp.read(file.path);

      await img
        .autocrop()
        .cover(
          250,
          250,
          jimp.HORIZONTAL_ALIGN_CENTER || jimp.VERTICAL_ALIGN_MIDDLE
        )
        .writeAsync(file.path);

      await fs.rename(file.path, path.join(FILE_DIR, file.filename));
      user.avatarURL = `localhost:${process.env.PORT}/avatars/${file.filename}`;
      return user;
    } catch (error) {
      console.log(error.message);
    }
  }
};
module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
  updateUserAvatar,
};
