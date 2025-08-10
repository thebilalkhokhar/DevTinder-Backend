const jwt = require("jsonwebtoken");
const User = require("../models/User");
const userAuthMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).send("Unauthorized: Please log in first.");
      return;
    }

    const decodedMessage = await jwt.verify(token, "MySecretKey");
    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized: " + error.message);
    return;
  }
};
module.exports = { userAuthMiddleware };
