const mongoose = require("mongoose");

const { mongoUri } = require("../config/config");

const connectDB = async () => {
  if (!mongoUri) {
    throw new Error("MONGO_URI is required");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};

module.exports = connectDB;
