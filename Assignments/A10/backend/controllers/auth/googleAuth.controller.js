import { OAuth2Client } from "google-auth-library";
import asyncHandler from "../../utils/asyncHandler.utils.js";
import User from "../../models/user.model.js";
import jwt from "jsonwebtoken";
import ApiError from "../../utils/errorHandler.utils.js";
import dotenv from "dotenv";
dotenv.config({ path: "./env/.env" });

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

export const googleAuth = asyncHandler(async (req, res, next) => {
  const { credential } = req.body; // Google ID token from frontend

  if (!credential) throw new ApiError(400, "Google credential is required");

  // Verify the token with Google
  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    throw new ApiError(401, "Invalid Google token");
  }

  const { sub: googleId, email, name, picture } = payload;

  // Find existing user by googleId or email
  let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

  if (user) {
    // If they registered with email/password before, link their Google account
    if (!user.googleId) {
      user.googleId = googleId;
      user.authProvider = "google";
      user.isEmailVerified = true; // Google already verified the email
      await user.save();
    }
  } else {
    // New user — create account
    // Generate a unique username from their Google name
    let baseUsername = name.replace(/\s+/g, "").toLowerCase().slice(0, 20);
    let username = baseUsername;
    let counter = 1;
    while (await User.findOne({ username })) {
      username = `${baseUsername}${counter++}`;
    }

    user = await User.create({
      username,
      email: email.toLowerCase(),
      password: null,
      avatar: picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      authProvider: "google",
      googleId,
      isEmailVerified: true,
    });
  }

  const userWithoutPassword = await User.findById(user._id).select("-password");
  const token = issueToken(user, res);

  res.status(200).json({
    success: true,
    message: "Google authentication successful",
    data: { user: userWithoutPassword, token },
  });
});
