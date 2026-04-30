import asyncHandler from "../../utils/asyncHandler.utils.js";
import Post from "../../models/post.model.js";

export const getAllPosts = asyncHandler(async (req, res, next) => {
  const { category, search, page = 1, limit = 9 } = req.query;

  // Public feed only shows published posts
  const filter = { status: "published" };

  if (category && category !== "All") {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Post.countDocuments(filter);

  const posts = await Post.find(filter)
    .populate("author", "username avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    message: "Posts fetched successfully",
    data: posts,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
});
