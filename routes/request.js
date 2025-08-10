const express = require("express");
const requestRouter = express.Router();
const { userAuthMiddleware } = require("../middlewares/auth");
const User = require("../models/User");
const ConnectionRequest = require("../models/ConnectionRequest");

requestRouter.post(
  "/request/create/:status/:userId",
  userAuthMiddleware,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const isAllowedStatuses = ["interested", "ignored"];
      if (!isAllowedStatuses.includes(status)) {
        return res.status(400).send("Invalid status");
      }
      const toUserIdCheck = await User.findById(toUserId);
      if (!toUserIdCheck) {
        return res.status(404).send("User not found");
      }
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(400).send("Connection request already exists");
      }
      const connectionRequest = await ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Connection request sent successfully",
        data,
      });
    } catch (error) {
      if (error.message === "Cannot send a connection request to yourself") {
        return res.status(400).send(error.message);
      }
      res.status(500).send("Internal server error");
    }
  }
);

requestRouter.post(
  "/request/respond/:status/:requestId",
  userAuthMiddleware,
  async (req, res) => {
    try {
      // Extracting parameters from the request
      const { status, requestId } = req.params;
      const loggedInId = req.user._id;
      // Validating the status
      const isAllowedStatuses = ["accepted", "rejected"];
      if (!isAllowedStatuses.includes(status)) {
        return res.status(400).send("Invalid status");
      }
      // validating the requestId
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInId,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .send("Connection request not found or already processed");
      }
      // Updating the connection request status
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: `Connection request ${status} successfully`,
        data,
      });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);

module.exports = requestRouter;
