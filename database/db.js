const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connect(process.env.DB_BASE_URI);
    // console.log("db connected!");
  } catch (error) {
    console.log("db connect failed");
  }
};

module.exports = connectDB;
