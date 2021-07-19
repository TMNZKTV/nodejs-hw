const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const sha256 = require("sha256");

const { User } = require("../db/userSchema");
const { Verification } = require("../db/verificationModel");

const path = require("path");
const fs = require("fs").promises;
const jimp = require("jimp");
const FILE_DIR = path.join("public", "avatars");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const signup = async (password, email, subscription) => {
  const user = new User({
    password,
    email,
    subscription,
  });
  await user.save();

  const code = sha256(email + process.env.JWT_SECRET);
  const verification = new Verification({
    userId: user._id,
    code: sha256("hello"),
  });
  await verification.save();

  const message = {
    to: email,
    from: "ezhov.kirill98@gmail.com",
    subject: "Thank you for registering",
    text: `Please, confirm your email adress POST https://localhost:8083/users/registration_confirmation/${code}`,
    html: `Please, confirm your email adress POST https://localhost:8083/users/registration_confirmation/${code}`,
  };
  await sgMail.send(message);

  return user;
};

const login = async (password, email) => {
  const user = await User.findOne({ email, verify: true });

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
    console.error("Invalid token.");
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
const signupConfirmation = async (code) => {
  const verification = await Verification.findOne({
    code,
    active: true,
  });

  if (!verification) {
    console.log("Invalid or inspired confirmation code!");
  }

  const user = await User.findById(verification.userId);
  if (!user) {
    console.log("No user found!");
  }

  verification.true = false;
  await verification.save();

  user.confirmed = true;
  await user.save();

  const message = {
    to: user.email,
    from: "ezhov.kirill98@gmail.com",
    subject: "Thank you for registering",
    text: "Sendgrid is awesome!",
    html: "<h1>Sendgrid is awesome!</h1>",
  };
  await sgMail.send(message);

  return user;
};

const signupConfirmationRefresh = async (email) => {
  if (!email) {
    console.log("Missing required field!");
  }

  const user = await User.findOne({ email });
  const code = sha256(email + process.env.JWT_SECRET);

  if (user.confirmed === false) {
    const verification = new Verification({
      userId: user._id,
      code: sha256("hello"),
    });
    await verification.save();
  }

  const message = {
    to: email,
    from: "ezhov.kirill98@gmail.com",
    subject: "Thank you for registering",
    text: `Please, confirm your email adress POST https://localhost:8083/users/registration_confirmation/${code}`,
    html: `Please, confirm your email adress POST https://localhost:8083/users/registration_confirmation/${code}`,
  };
  await sgMail.send(message);

  return user;
};

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
  updateUserAvatar,
  signupConfirmation,
  signupConfirmationRefresh,
};
