import asyncHandler from "../../utils/asyncHandler.utils.js";
import Post from "../../models/post.model.js";
import ApiError from "../../utils/errorHandler.utils.js";

export const deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Only the author or an admin can delete
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
    data: null,
  });
});
