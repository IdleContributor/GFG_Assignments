import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      minlength: [20, "Content must be at least 20 characters"],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Technology", "Lifestyle", "Travel", "Food", "Health", "Education", "Other"],
      default: "Other",
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    coverImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    // "published" = visible to everyone, "draft" = only visible to author
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
  },
  { timestamps: true }
);

// Auto-generate excerpt from content if not provided
postSchema.pre("save", async function () {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 200) + "...";
  }
});

const Post = mongoose.model("Post", postSchema);
export default Post;
