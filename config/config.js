const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;
const nodeEnv = process.env.NODE_ENV || "development";

if (!mongoUri) {
  throw new Error("MONGO_URI is required");
}

module.exports = {
  port,
  mongoUri,
  nodeEnv,
};
