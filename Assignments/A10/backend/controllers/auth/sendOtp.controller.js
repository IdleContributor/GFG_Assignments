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

  // Try to send email with a longer timeout for Railway
  const emailPromise = sendOtpEmail(email, otp);
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Email timeout')), 30000) // 30 seconds
  );

  try {
    await Promise.race([emailPromise, timeoutPromise]);
    console.log(`✅ OTP email sent successfully to ${email}`);
  } catch (err) {
    console.error('❌ Failed to send OTP email:');
    console.error('Error message:', err.message);
    console.error('Error code:', err.code);
    console.error('Full error:', JSON.stringify(err, null, 2));
    
    // Log the OTP to console as fallback (only in development)
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔑 OTP for ${email}: ${otp}`);
    }
    // Continue anyway - OTP is saved in database
  }

  res.status(200).json({
    success: true,
    message: "OTP sent to your email address",
  });
});
