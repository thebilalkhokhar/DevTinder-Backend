const express = require("express");
const profileRouter = express.Router();
const { userAuthMiddleware } = require("../middlewares/auth");
const { validateProfileUpdateData } = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuthMiddleware, async (req, res) => {
  try {
    // Access the user from the request object
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Error logging in: " + error.message);
  }
});

profileRouter.patch("/profile/update", userAuthMiddleware, async (req, res) => {
  try{
    validateProfileUpdateData(req);
    if(!validateProfileUpdateData(req)) {
      return res.status(400).send("Invalid update fields");
    }
    
    // Acess the user from the request object
    const user = req.user;
    
    // Update user profile
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });
    // save the updated user
    await user.save();
    // res.send(user);
    res.json({
      message: `${user.firstName}, your profile has been updated successfully! 🎉`,
      data: user,
    });

  } catch (error) {
    res.status(400).send("Error updating profile: " + error.message);
  }
});

profileRouter.patch("/profile/password", userAuthMiddleware, async (req, res) => {
  try {
    const {currentPassword, newPassword} = req.body;
    // Validate the current password
    const user = req.user;
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).send("Current password is incorrect.");
    }
    // Encrypt the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();
    res.send("Password updated successfully! 🎉");
  } catch (error) {
    res.status(400).send("Error updating password: " + error.message);
  }
});

module.exports = profileRouter;