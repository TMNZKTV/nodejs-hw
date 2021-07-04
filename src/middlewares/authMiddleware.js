const jsonwebtoken = require("jsonwebtoken");
const { User } = require("../db/userSchema");

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(409).json({ message: "Please provide a token" });
  }

  const [tokenType, token] = authorization.split(" ");

  if (tokenType !== "Bearer") {
    res.status(409).json({ message: "Please provide a token" });
  }

  try {
    const { _id } = jsonwebtoken.decode(token, process.env.JWT_SECRET);

    const user = await User.findOne({ token });

    if (!user) {
      res.status(401).json({ message: "Not authorized" });
    }

    req.userId = _id;
    req.token = token;
    next();
  } catch (error) {
    res.status(500).json({ message: "Invalid token!" });
  }
};

module.exports = {
  authMiddleware,
};
