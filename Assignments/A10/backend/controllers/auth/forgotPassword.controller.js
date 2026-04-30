import asyncHandler from "../../utils/asyncHandler.utils.js";
import User from "../../models/user.model.js";
import OTP from "../../models/otp.model.js";
import ApiError from "../../utils/errorHandler.utils.js";
import { sendOtpEmail } from "../../config/nodemailer.config.js";

// Step 1 — send OTP only to verified, registered email addresses
export const forgotPasswordSendOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email: email.toLowerCase() });

  // Not registered or not verified — return a 404 so frontend shows a clear error
  if (!user || !user.isEmailVerified) {
    throw new ApiError(404, "No account found with this email address.");
  }

  // Google-only account — no password to reset
  if (user.authProvider === "google" && !user.password) {
    throw new ApiError(400, "This account uses Google sign-in. Password reset is not available.");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await OTP.deleteMany({ email: email.toLowerCase() });
  await OTP.create({ email: email.toLowerCase(), otp });
  await sendOtpEmail(email, otp);

  res.status(200).json({
    success: true,
    message: "Reset code sent to your email.",
  });
});

// Step 2 — verify OTP + set new password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new ApiError(400, "Email, OTP, and new password are required");
  }
  if (newPassword.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  // Confirm the user still exists and is verified
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.isEmailVerified) {
    throw new ApiError(404, "No account found with this email address.");
  }

  const otpRecord = await OTP.findOne({ email: email.toLowerCase() });
  if (!otpRecord) {
    throw new ApiError(400, "OTP expired or not found. Please request a new one.");
  }
  if (otpRecord.otp !== otp.trim()) {
    throw new ApiError(400, "Invalid OTP. Please try again.");
  }

  const bcrypt = await import("bcryptjs");
  const hashedPassword = await bcrypt.default.hash(newPassword, 10);

  await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { password: hashedPassword }
  );

  await OTP.deleteMany({ email: email.toLowerCase() });

  res.status(200).json({
    success: true,
    message: "Password reset successfully. You can now log in.",
  });
});
