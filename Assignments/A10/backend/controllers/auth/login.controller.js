import asyncHandler from "../../utils/asyncHandler.utils.js";
import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../../utils/errorHandler.utils.js";

const issueToken = (user, res) => {
  const token = jwt.sign(
    { _id: user._id, role: user.role, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
  });

  return token;
};

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new ApiError(401, "Invalid credentials");

  // Google-only account trying to use password login
  if (user.authProvider === "google" && !user.password) {
    throw new ApiError(400, "This account uses Google sign-in. Please continue with Google.");
  }

  // Email not verified yet
  if (!user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email before logging in.");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid credentials");

  const userWithoutPassword = await User.findById(user._id).select("-password");
  const token = issueToken(user, res);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: { user: userWithoutPassword, token },
  });
});
