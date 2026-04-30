import asyncHandler from "../../utils/asyncHandler.utils.js";
import Post from "../../models/post.model.js";
import ApiError from "../../utils/errorHandler.utils.js";

export const likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const userId = req.user._id.toString();
  const alreadyLiked = post.likes.some((id) => id.toString() === userId);

  if (alreadyLiked) {
    // Unlike
    post.likes = post.likes.filter((id) => id.toString() !== userId);
  } else {
    // Like
    post.likes.push(req.user._id);
  }

  await post.save();

  res.status(200).json({
    success: true,
    message: alreadyLiked ? "Post unliked" : "Post liked",
    data: { likes: post.likes.length, liked: !alreadyLiked },
  });
});
