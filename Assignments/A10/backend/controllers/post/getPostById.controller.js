import asyncHandler from "../../utils/asyncHandler.utils.js";
import Post from "../../models/post.model.js";
import ApiError from "../../utils/errorHandler.utils.js";

export const getPostById = asyncHandler(async (req, res, next) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("author", "username avatar");

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  res.status(200).json({
    success: true,
    message: "Post fetched successfully",
    data: post,
  });
});
