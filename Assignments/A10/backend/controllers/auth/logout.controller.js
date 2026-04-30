import asyncHandler from "../../utils/asyncHandler.utils.js";

export const logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});
