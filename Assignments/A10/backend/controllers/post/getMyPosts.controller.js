import asyncHandler from "../../utils/asyncHandler.utils.js";
import Post from "../../models/post.model.js";

export const getMyPosts = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 9, search, status } = req.query;

  // Base filter — always scoped to the logged-in user
  const filter = { author: req.user._id };

  // Optional status filter: "published" | "draft" | omit for all
  if (status === "published" || status === "draft") {
    filter.status = status;
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

  // Accurate all-time totals via aggregation (not limited to current page)
  const [stats] = await Post.aggregate([
    { $match: { author: req.user._id } },
    {
      $group: {
        _id: null,
        totalLikes: { $sum: { $size: "$likes" } },
        totalViews: { $sum: "$views" },
        publishedCount: {
          $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
        },
        draftCount: {
          $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "Your posts fetched successfully",
    data: posts,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
    // All-time stats across every post by this user
    stats: {
      totalLikes: stats?.totalLikes ?? 0,
      totalViews: stats?.totalViews ?? 0,
      publishedCount: stats?.publishedCount ?? 0,
      draftCount: stats?.draftCount ?? 0,
    },
  });
});
