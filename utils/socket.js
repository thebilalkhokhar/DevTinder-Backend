const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/Chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
    // handle events
    socket.on("joinChat", ({ firstName, lastName, userId, targetUserId }) => {
      const room = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " " + lastName + " joining room ", room);
      socket.join(room);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const room = getSecretRoomId(userId, targetUserId);

          let chat = await Chat.findOne({
            participants: {
              $all: [userId, targetUserId],
            },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();
          console.log(firstName + " " + lastName + " " + text);
          io.to(room).emit("messageReceived", { firstName, lastName, text });
        } catch (error) {
          console.log(error);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = {
  initializeSocket,
};
