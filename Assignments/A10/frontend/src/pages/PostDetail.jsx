import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Eye, Clock, Tag, ArrowLeft, Edit, Trash2, AlertCircle } from "lucide-react";
import api from "../utils/api";

const PostDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/v1/${id}`);
        const data = res.data.data;
        setPost(data);
        setLikeCount(data.likes?.length || 0);
        if (user) {
          setLiked(data.likes?.some((l) => l === user._id || l._id === user._id));
        }
      } catch (err) {
        setError(err.response?.data?.message || "Post not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) { navigate("/login"); return; }
    setLikeLoading(true);
    try {
      const res = await api.patch(`/posts/v1/${id}/like`);
      setLiked(res.data.data.liked);
      setLikeCount(res.data.data.likes);
    } catch (err) {
      console.error("Like error:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/posts/v1/${id}`);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete post");
    }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-10 w-10 border-t-2"
          style={{ borderColor: "var(--primary)" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg flex items-center justify-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
        <Link to="/" className="btn-outline inline-block">Back to Home</Link>
      </div>
    );
  }

  const isAuthor = user && post?.author?._id === user._id;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:opacity-80"
        style={{ "--hover-color": "var(--primary)" }}
      >
        <ArrowLeft size={16} />
        Back to posts
      </Link>

      {/* Cover Image */}
      <div className="rounded-2xl overflow-hidden h-64 md:h-80 bg-gray-100">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800";
          }}
        />
      </div>

      {/* Header */}
      <div className="space-y-4">
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: "var(--primary-light)", color: "var(--primary)" }}
        >
          <Tag size={10} />
          {post.category}
        </span>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={post.author?.avatar}
              alt={post.author?.username}
              className="w-10 h-10 rounded-full bg-gray-200"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">{post.author?.username}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={11} />
                {timeAgo(post.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* <span className="flex items-center gap-1 text-sm text-gray-400">
              <Eye size={15} />
              {post.views}
            </span>

            <button
              onClick={handleLike}
              disabled={likeLoading}
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-all"
              style={
                liked
                  ? { backgroundColor: "#fee2e2", color: "#ef4444" }
                  : { backgroundColor: "#f3f4f6", color: "#6b7280" }
              }
            >
              <Heart size={15} fill={liked ? "currentColor" : "none"} />
              {likeCount}
            </button> */}

            {isAuthor && (
              <div className="flex items-center gap-2">
                <Link
                  to={`/edit/${post._id}`}
                  className="p-2 rounded-lg text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors"
                  title="Edit"
                >
                  <Edit size={20} />
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
        {post.content}
      </div>
    </motion.article>
  );
};

export default PostDetail;
