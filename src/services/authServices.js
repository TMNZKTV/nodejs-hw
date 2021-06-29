const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const { User } = require("../db/userSchema");

const signup = async (password, email, subscription) => {
  const user = new User({ password, email, subscription });
  await user.save();
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

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
};
