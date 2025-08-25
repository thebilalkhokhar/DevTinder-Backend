const express = require("express");
const { userAuthMiddleware } = require("../middlewares/auth");
const { Chat } = require("../models/Chat");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuthMiddleware, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;
  try {
    let chat = await Chat.findOne({
      participants: {
        $all: [userId, targetUserId],
      },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (error) {
    console.log(error);
  }
});

module.exports = chatRouter;
