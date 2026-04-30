import asyncHandler from "../../utils/asyncHandler.utils.js";
import User from "../../models/user.model.js";
import OTP from "../../models/otp.model.js";
import bcrypt from "bcryptjs";
import ApiError from "../../utils/errorHandler.utils.js";

export const register = asyncHandler(async (req, res, next) => {
  const { username, email, password, otp } = req.body;

  if (!username || !email || !password || !otp) {
    throw new ApiError(400, "All fields including OTP are required");
  }

  // Verify OTP
  const otpRecord = await OTP.findOne({ email: email.toLowerCase() });
  if (!otpRecord) {
    throw new ApiError(400, "OTP expired or not found. Please request a new one.");
  }
  if (otpRecord.otp !== otp.trim()) {
    throw new ApiError(400, "Invalid OTP. Please try again.");
  }

  // Check for existing verified user
  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username }],
  });
  if (existingUser && existingUser.isEmailVerified) {
    throw new ApiError(400, "User with this email or username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Upsert: if an unverified record exists (e.g. previous failed attempt), overwrite it
  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    {
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username)}`,
      authProvider: "local",
      isEmailVerified: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Clean up used OTP
  await OTP.deleteMany({ email: email.toLowerCase() });

  const createdUser = await User.findById(user._id).select("-password");

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: createdUser,
  });
});
