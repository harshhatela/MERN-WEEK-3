const mongoose = require("mongoose");

/**
 * connectDB — connects to MongoDB using the URI stored in the MONGO_URI
 * environment variable. Logs a success message on connection, or logs
 * the error and exits the process with code 1 on failure.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit with failure so the app doesn't run without a DB
  }
};

module.exports = connectDB;
