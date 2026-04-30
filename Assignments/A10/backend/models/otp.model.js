import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  // MongoDB TTL index — document auto-deleted 10 minutes after createdAt
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // seconds
  },
});

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
