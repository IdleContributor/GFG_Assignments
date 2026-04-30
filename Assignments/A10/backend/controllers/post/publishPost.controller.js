import asyncHandler from "../../utils/asyncHandler.utils.js";
import Post from "../../models/post.model.js";
import ApiError from "../../utils/errorHandler.utils.js";

export const publishPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) throw new ApiError(404, "Post not found");

  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to publish this post");
  }

  if (post.status === "published") {
    throw new ApiError(400, "Post is already published");
  }

  post.status = "published";
  await post.save();

  const updated = await Post.findById(post._id).populate("author", "username avatar");

  res.status(200).json({
    success: true,
    message: "Post published successfully",
    data: updated,
  });
});
