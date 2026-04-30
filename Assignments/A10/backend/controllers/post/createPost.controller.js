import asyncHandler from "../../utils/asyncHandler.utils.js";
import Post from "../../models/post.model.js";
import ApiError from "../../utils/errorHandler.utils.js";

export const createPost = asyncHandler(async (req, res, next) => {
  const { title, content, excerpt, category, tags, coverImage, status } = req.body;

  if (!title || !content || !category) {
    throw new ApiError(400, "Title, content, and category are required");
  }

  const postStatus = status === "draft" ? "draft" : "published";

  const post = await Post.create({
    title,
    content,
    excerpt,
    category,
    tags: tags ? tags.split(",").map((t) => t.trim()) : [],
    coverImage,
    author: req.user._id,
    status: postStatus,
  });

  const populatedPost = await Post.findById(post._id).populate("author", "username avatar");

  res.status(201).json({
    success: true,
    message: postStatus === "draft" ? "Draft saved successfully" : "Post published successfully",
    data: populatedPost,
  });
});
