const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const cookie = require("cookie");
// Api call to add new user in db
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the request body
    validateSignupData(req);
    const { firstName, lastName, email, password } = req.body;

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    // Add token to cookie and send it to the client
    res.cookie("token", token);
    res.json({ message: "User added successfully! 🎉", data: savedUser });
  } catch (error) {
    res.status(400).send("Error adding user:" + error.message);
  }
});

// Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate the email
    const user = await User.findOne({ email: email });
    if (!user) {
      res.send("Credentials are not valid!");
    }
    // Validate the password
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      res.send("Credentials are not valid!");
    } else {
      // Create a JWT token
      const token = await user.getJWT();
      // Add token to cookie and send it to the client
      res.cookie("token", token);
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Error logging in: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Logout successful!");
  } catch (error) {
    res.status(400).send("Error logging out: " + error.message);
  }
});

module.exports = authRouter;
