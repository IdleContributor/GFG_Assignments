import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft } from "lucide-react";
import api from "../utils/api";

const CATEGORIES = ["Technology", "Lifestyle", "Travel", "Food", "Health", "Education", "Other"];

const EditPost = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", content: "", excerpt: "",
    category: "Technology", tags: "", coverImage: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/v1/${id}`);
        const post = res.data.data;
        if (post.author._id !== user._id) { navigate(`/posts/${id}`); return; }
        setForm({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || "",
          category: post.category,
          tags: post.tags?.join(", ") || "",
          coverImage: post.coverImage || "",
        });
      } catch (err) {
        setError("Failed to load post");
      } finally {
        setFetching(false);
      }
    };
    fetchPost();
  }, [id, user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.put(`/posts/v1/${id}`, form);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2" style={{ borderColor: "var(--primary)" }} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to={`/posts/${id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:opacity-80 transition-opacity">
        <ArrowLeft size={16} />
        Back to post
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Title *</label>
            <input
              type="text" name="title" value={form.title} onChange={handleChange}
              required minLength={5} className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Tags</label>
              <input
                type="text" name="tags" value={form.tags} onChange={handleChange}
                placeholder="react, javascript" className="input-field"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Cover Image URL</label>
            <input type="url" name="coverImage" value={form.coverImage} onChange={handleChange} className="input-field" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Excerpt</label>
            <textarea
              name="excerpt" value={form.excerpt} onChange={handleChange}
              rows={2} maxLength={300} className="input-field resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Content *</label>
            <textarea
              name="content" value={form.content} onChange={handleChange}
              rows={12} required minLength={20} className="input-field resize-y"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {loading ? <span className="spinner" /> : "Save Changes"}
            </button>
            <Link to={`/posts/${id}`} className="btn-outline">Cancel</Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditPost;
