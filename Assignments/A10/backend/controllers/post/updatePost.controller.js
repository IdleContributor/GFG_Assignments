import asyncHandler from "../../utils/asyncHandler.utils.js";
import Post from "../../models/post.model.js";
import ApiError from "../../utils/errorHandler.utils.js";

export const updatePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // Only the author or an admin can update
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to update this post");
  }

  const { title, content, excerpt, category, tags, coverImage } = req.body;

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      title,
      content,
      excerpt,
      category,
      tags: tags ? tags.split(",").map((t) => t.trim()) : post.tags,
      coverImage,
    },
    { new: true, runValidators: true }
  ).populate("author", "username avatar");

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: updatedPost,
  });
});
