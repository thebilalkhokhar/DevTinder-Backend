const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
module.exports = connectDB;
