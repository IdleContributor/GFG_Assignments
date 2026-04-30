import { Link } from "react-router-dom";
import { Heart, Eye, Clock, Tag } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORY_COLORS = {
  Technology: "bg-blue-100 text-blue-700",
  Lifestyle:  "bg-pink-100 text-pink-700",
  Travel:     "bg-green-100 text-green-700",
  Food:       "bg-orange-100 text-orange-700",
  Health:     "bg-teal-100 text-teal-700",
  Education:  "bg-purple-100 text-purple-700",
  Other:      "bg-gray-100 text-gray-700",
};

const PostCard = ({ post }) => {
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card group"
    >
      {/* Cover Image */}
      <Link to={`/posts/${post._id}`}>
        <div className="h-48 overflow-hidden bg-gray-100">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800";
            }}
          />
        </div>
      </Link>

      <div className="p-5 space-y-3">
        {/* Category */}
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
            CATEGORY_COLORS[post.category] || CATEGORY_COLORS.Other
          }`}
        >
          <Tag size={10} />
          {post.category}
        </span>

        {/* Title */}
        <Link to={`/posts/${post._id}`}>
          <h3
            className="font-bold text-lg leading-snug text-gray-900 transition-colors line-clamp-2 hover:opacity-80"
            style={{ "--tw-text-opacity": 1 }}
          >
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <img
              src={post.author?.avatar}
              alt={post.author?.username}
              className="w-7 h-7 rounded-full bg-gray-200"
            />
            <span className="text-xs font-medium text-gray-700">
              {post.author?.username}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {/* <span className="flex items-center gap-1">
              <Heart size={12} />
              {post.likes?.length || 0}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {post.views || 0}
            </span> */}
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {timeAgo(post.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
