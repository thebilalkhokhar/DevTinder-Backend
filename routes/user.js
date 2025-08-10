const express = require("express");
const userRouter = express.Router();
const User = require("../models/User");
const { userAuthMiddleware } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");

userRouter.get(
  "/user/requests/received",
  userAuthMiddleware,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;

      const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUserId,
        status: "interested",
      }).populate("fromUserId", "firstName lastName photoUrl bio skills");

      res.json({
        message: "Received connection requests",
        data: connectionRequests,
      });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);

userRouter.get("/user/connections", userAuthMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId, status: "accepted" },
        { toUserId: loggedInUserId, status: "accepted" },
      ],
    })
      .populate("fromUserId", "_id firstName lastName bio photoUrl skills")
      .populate("toUserId", "_id firstName lastName bio photoUrl skills");
    const data = connections.map((connection) =>
      connection.fromUserId._id.toString() === loggedInUserId.toString()
        ? connection.toUserId
        : connection.fromUserId
    );
    res.json({
      message: "User connections fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).send("Internal server error " + error.message);
  }
});

userRouter.get("/feed", userAuthMiddleware, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserIds = new Set();
    connections.forEach((con) => {
      hideUserIds.add(con.fromUserId._id.toString());
      hideUserIds.add(con.toUserId._id.toString());
    });

    const feedUser = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserIds) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("_id firstName lastName photoUrl bio skills")
      .skip(skip)
      .limit(limit);
    res.send(feedUser);
  } catch (error) {
    res.status(500).send("Internal server error " + error.message);
  }
});

// // fetch all users
// userRouter.get("/users", async (req, res) => {
//   // Fetch all the users data from the Database
//   const users = await User.find({});
//   try {
//     res.send(users);
//   } catch (error) {
//     res.status(404).send("Users not found: " + error.message);
//   }
// });

// // fetch user by email
// userRouter.get("/singleUser", async (req, res) => {
//   console.log(req.body);
//   const userEmail = req.body.email;

//   // Fetch the user data from the Database
//   const users = await User.findOne({ email: userEmail });
//   try {
//     res.send(users);
//   } catch (error) {
//     res.status(404).send("User not found: " + error.message);
//   }
// });

// // fetch user by id
// userRouter.get("/userById", async (req, res) => {
//   console.log(req.body);
//   const userId = req.body._id;

//   // Fetch the user data from the Database
//   const users = await User.findById({ _id: userId });
//   try {
//     res.send(users);
//   } catch (error) {
//     res.status(404).send("User not found: " + error.message);
//   }
// });

// // fetch user by id and delete
// userRouter.delete("/userById", async (req, res) => {
//   console.log(req.body);
//   const userId = req.body._id;

//   // Fetch the user data from the Database
//   try {
//     const users = await User.findByIdAndDelete({ _id: userId });
//     res.send("User deleted successfully!");
//   } catch (error) {
//     res.status(404).send("User not found: " + error.message);
//   }
// });

// // fetch user by id and update
// userRouter.patch("/userById/:userId", async (req, res) => {
//   console.log(req.body);
//   const userId = req.params.userId;
//   const data = req.body;
//   // Fetch the user data from the Database
//   try {
//     const AllowedUpdates = [
//       "firstName",
//       "lastName",
//       "password",
//       "age",
//       "gender",
//       "bio",
//       "skills",
//     ];
//     const isUpdateAllowed = Object.keys(data).every((update) =>
//       AllowedUpdates.includes(update)
//     );
//     if (!isUpdateAllowed) {
//       return res.status(400).send("Invalid updates!");
//     }
//     const users = await User.findByIdAndUpdate({ _id: userId }, data, {
//       returnDocument: "after",
//     });
//     console.log(users);
//     res.send("User updated successfully!");
//   } catch (error) {
//     res.status(404).send("User not found: " + error.message);
//   }
// });

module.exports = userRouter;
