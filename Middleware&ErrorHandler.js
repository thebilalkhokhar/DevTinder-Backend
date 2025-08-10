const express = require("express");
const app = express();
const {
  adminAuthMiddleware,
  userAuthMiddleware,
} = require("./middlewares/auth");

////////////////////////////////////////////////////
// Auth Middleware
app.use("/admin", adminAuthMiddleware); // Apply the auth middleware to all /admin routes);

app.get("/admin/getAllData", (req, res, next) => {
  res.send("Admin Data Sent");
});

////////////////////////////////////////////////////
// Request Handlers
app.post("/user/login", (req, res) => {
  try {
    res.send("User Login Successful"); // Handle user login
  }
  catch (error) {
    res.status(500).send("Internal Server Error"); // Handle errors
  }
});

app.get("/user", userAuthMiddleware, (req, res, next) => {
  next(); // Call next middleware or route handler
});
app.get(
  "/user/getAllData",
  (req, res, next) => {
    // res.send("2nd user Response"); // Send a response
    next(); // Call next middleware or route handler
  },
  (req, res, next) => {
    console.log("Final middleware after /user route"); // Final middleware
    res.send("3rd & Final response for /user"); // Final response
  }
);

// app.use("/", (err,req, res, next) => {
//     if(err) {
//         res.status(500).send("Internal Server Error"); // Handle errors
//     }
//   res.send("Hello World!"); // Basic route to test server
// });
app.use((err, req, res, next) => {
  console.error("Error caught:", err);
  res.status(500).send("Internal Server Error");
});

app.get("/test-error", (req, res, next) => {
  const error = new Error("This is a test error");
  next(error); // Pass error to error-handling middleware
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
