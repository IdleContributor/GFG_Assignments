import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenSquare, Search, Edit, Trash2, Eye, Heart,
  Clock, Tag, ChevronLeft, ChevronRight, FileText,
  Globe, BookMarked, Send,
} from "lucide-react";
import api from "../utils/api";

const CATEGORY_COLORS = {
  Technology: "bg-blue-100 text-blue-700",
  Lifestyle:  "bg-pink-100 text-pink-700",
  Travel:     "bg-green-100 text-green-700",
  Food:       "bg-orange-100 text-orange-700",
  Health:     "bg-teal-100 text-teal-700",
  Education:  "bg-purple-100 text-purple-700",
  Other:      "bg-gray-100 text-gray-700",
};

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  { key: "all",       label: "All Posts",  icon: <FileText size={14} /> },
  { key: "published", label: "Published",  icon: <Globe size={14} /> },
  { key: "draft",     label: "Drafts",     icon: <BookMarked size={14} /> },
];

// ── Main page ─────────────────────────────────────────────────────────────────
const MyPosts = ({ user }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ totalLikes: 0, totalViews: 0, publishedCount: 0, draftCount: 0 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const [publishingId, setPublishingId] = useState(null);
  const [gridKey, setGridKey] = useState(0);

  useEffect(() => {
    // Only redirect if user is explicitly null (not logged in)
    // undefined means still loading from localStorage
    const token = localStorage.getItem("token");
    if (user === null && !token) {
      navigate("/login");
    }
  }, [user, navigate]);

  const fetchPosts = useCallback(async () => {
    // Allow fetch if token exists, even if user prop hasn't loaded yet
    const token = localStorage.getItem("token");
    
    if (!user && !token) {
      return;
    }
    
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (tab !== "all") params.status = tab;

      const res = await api.get("/posts/v1/user/me", { params });
      
      setPosts(res.data.data);
      setPagination(res.data.pagination);
      setStats(res.data.stats);
      setGridKey((k) => k + 1);
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
      console.error("Error response:", err.response?.data);
      // If API returns 401, redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [user, search, tab, page, navigate]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleTabChange = (key) => {
    setTab(key);
    setPage(1);
    setSearch("");
    setSearchInput("");
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    setDeletingId(postId);
    try {
      await api.delete(`/posts/v1/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      setPagination((prev) => ({ ...prev, total: Math.max(0, (prev.total || 1) - 1) }));
      setStats((prev) => ({ ...prev, publishedCount: Math.max(0, prev.publishedCount - 1) }));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handlePublish = async (postId) => {
    setPublishingId(postId);
    try {
      const res = await api.patch(`/posts/v1/${postId}/publish`);
      // Update the card in-place
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? res.data.data : p))
      );
      setStats((prev) => ({
        ...prev,
        publishedCount: prev.publishedCount + 1,
        draftCount: Math.max(0, prev.draftCount - 1),
      }));
    } catch (err) {
      console.error("Publish failed:", err);
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">My Posts</h1>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={
              tab === key
                ? { backgroundColor: "#fff", color: "var(--primary)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }
                : { color: "#6b7280" }
            }
          >
            {icon}
            {label}
            {key === "draft" && stats.draftCount > 0 && (
              <span
                className="ml-1 text-xs px-1.5 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: "var(--primary-light)", color: "var(--primary)" }}
              >
                {stats.draftCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
        <div className="input-wrapper flex-1">
          <Search size={18} className="input-icon" />
          <input
            type="text"
            placeholder="Search your posts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input-field has-icon w-full"
          />
        </div>
        <button type="submit" className="btn-primary shrink-0">Search</button>
      </form>

      {/* Grid */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2" style={{ borderColor: "var(--primary)" }} />
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 space-y-4"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: "var(--primary-light)" }}
            >
              {tab === "draft" ? <BookMarked size={28} style={{ color: "var(--primary)" }} /> : <FileText size={28} style={{ color: "var(--primary)" }} />}
            </div>
            <p className="text-gray-500 text-lg">
              {search
                ? "No posts match your search."
                : tab === "draft"
                ? "No drafts saved yet."
                : tab === "published"
                ? "No published posts yet."
                : "You haven't written anything yet."}
            </p>
            {!search && (
              <Link to="/create" className="btn-primary inline-flex items-center gap-2">
                <PenSquare size={16} />
                {tab === "draft" ? "Start a draft" : "Write your first post"}
              </Link>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={gridKey}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {posts.map((post) => (
                <MyPostCard
                  key={post._id}
                  post={post}
                  onDelete={handleDelete}
                  onPublish={handlePublish}
                  deletingId={deletingId}
                  publishingId={publishingId}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

// ── Card ──────────────────────────────────────────────────────────────────────
const MyPostCard = ({ post, onDelete, onPublish, deletingId, publishingId }) => {
  const isDeleting  = deletingId  === post._id;
  const isPublishing = publishingId === post._id;
  const isDraft = post.status === "draft";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDeleting ? 0.4 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card group relative"
    >
      {/* Draft ribbon */}
      {isDraft && (
        <div
          className="absolute top-3 left-3 z-10 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: "#fef3c7", color: "#d97706" }}
        >
          <BookMarked size={10} />
          Draft
        </div>
      )}

      {/* Cover */}
      <Link to={isDraft ? "#" : `/posts/${post._id}`} tabIndex={isDraft ? -1 : 0}>
        <div className="h-44 overflow-hidden bg-gray-100">
          <img
            src={post.coverImage}
            alt={post.title}
            className={`w-full h-full object-cover transition-transform duration-300 ${!isDraft ? "group-hover:scale-105" : "opacity-60"}`}
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"; }}
          />
        </div>
      </Link>

      {/* Edit / Delete overlay */}
      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          to={`/edit/${post._id}`}
          className="p-2 rounded-lg bg-white shadow text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors"
          title="Edit"
        >
          <Edit size={18} />
        </Link>
        <button
          onClick={() => onDelete(post._id)}
          disabled={isDeleting}
          className="p-2 rounded-lg bg-white shadow text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
          title="Delete"
        >
          {isDeleting
            ? <span className="block w-4.5 h-4.5 border-t-2 border-red-400 rounded-full animate-spin" />
            : <Trash2 size={18} />}
        </button>
      </div>

      <div className="p-5 space-y-3">
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] || CATEGORY_COLORS.Other}`}>
          <Tag size={10} />
          {post.category}
        </span>

        <Link to={isDraft ? `/edit/${post._id}` : `/posts/${post._id}`}>
          <h3 className="font-bold text-base leading-snug text-gray-900 hover:opacity-75 transition-opacity line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {timeAgo(post.createdAt)}
          </span>
          {isDraft ? (
            /* Publish button for drafts */
            <button
              onClick={() => onPublish(post._id)}
              disabled={isPublishing}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full transition-all disabled:opacity-50"
              style={{ backgroundColor: "var(--primary-light)", color: "var(--primary)" }}
            >
              {isPublishing
                ? <span className="block w-3 h-3 border-t-2 rounded-full animate-spin" style={{ borderColor: "var(--primary)" }} />
                : <Send size={11} />}
              Publish
            </button>
          ) : (
            <div className="flex items-center gap-3">
              {/* <span className="flex items-center gap-1"><Heart size={11} />{post.likes?.length || 0}</span> */}
              {/* <span className="flex items-center gap-1"><Eye size={11} />{post.views || 0}</span> */}
              <span className="text-xs text-gray-400">Published</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MyPosts;
