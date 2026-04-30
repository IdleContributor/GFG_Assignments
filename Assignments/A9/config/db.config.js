import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Same pattern as project/backend/config/db.config.js
// Retries connection up to 5 times with 5-second delays
const connectDB = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected successfully");
      return;
    } catch (err) {
      console.log(
        `MongoDB connection failed (Attempt ${i + 1}/${retries}). Retrying in ${delay / 1000}s...`,
      );
      if (i === retries - 1) {
        console.error("All connection retries failed:", err.message);
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export default connectDB;
