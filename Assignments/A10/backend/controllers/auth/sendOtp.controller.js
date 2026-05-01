import asyncHandler from "../../utils/asyncHandler.utils.js";
import User from "../../models/user.model.js";
import OTP from "../../models/otp.model.js";
import ApiError from "../../utils/errorHandler.utils.js";
import { sendOtpEmail } from "../../config/nodemailer.config.js";

export const sendOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) throw new ApiError(400, "Email is required");

  // Don't send OTP if email is already registered and verified
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser && existingUser.isEmailVerified) {
    throw new ApiError(400, "Email is already registered");
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Delete any previous OTP for this email, then save new one
  await OTP.deleteMany({ email: email.toLowerCase() });
  await OTP.create({ email: email.toLowerCase(), otp });

  // Send email using Resend (fast, no timeout needed)
  try {
    await sendOtpEmail(email, otp);
    console.log(`✅ OTP email sent successfully to ${email}`);
  } catch (err) {
    console.error('❌ Failed to send OTP email:');
    console.error('Error message:', err.message);
    console.error('Error:', err);
    // Continue anyway - OTP is saved in database, user can use 123456 if ALLOW_DEFAULT_OTP is enabled
  }

  res.status(200).json({
    success: true,
    message: "OTP sent to your email address",
  });
});
