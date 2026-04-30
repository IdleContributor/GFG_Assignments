import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, BookOpen, Save } from "lucide-react";
import api from "../utils/api";

const CATEGORIES = ["Technology", "Lifestyle", "Travel", "Food", "Health", "Education", "Other"];

const CreatePost = ({ user }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", content: "", excerpt: "",
    category: "Technology", tags: "", coverImage: "",
  });
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [drafting, setDrafting] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (status) => {
    setError("");
    if (status === "published") setPublishing(true);
    else setDrafting(true);

    try {
      const res = await api.post("/posts/v1", { ...form, status });
      if (status === "draft") {
        navigate("/my-posts");
      } else {
        navigate(`/posts/${res.data.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setPublishing(false);
      setDrafting(false);
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    submit("published");
  };

  const handleDraft = (e) => {
    e.preventDefault();
    // Drafts only need a title — relax the content requirement
    if (!form.title || form.title.length < 5) {
      setError("Title must be at least 5 characters to save a draft");
      return;
    }
    // Pad content to pass model minlength if empty
    const draftForm = {
      ...form,
      content: form.content || "Draft — content coming soon.",
    };
    setForm(draftForm);
    submit("draft");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:opacity-80 transition-opacity"
      >
        <ArrowLeft size={16} />
        Back to posts
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        <form className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Title *</label>
            <input
              type="text" name="title" value={form.title} onChange={handleChange}
              placeholder="Enter a compelling title..." minLength={5}
              className="input-field"
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
              <label className="text-sm font-medium text-gray-700">
                Tags <span className="text-gray-400 font-normal">(comma-separated)</span>
              </label>
              <input
                type="text" name="tags" value={form.tags} onChange={handleChange}
                placeholder="react, javascript, web" className="input-field"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Cover Image URL <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="url" name="coverImage" value={form.coverImage} onChange={handleChange}
              placeholder="https://example.com/image.jpg" className="input-field"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Excerpt{" "}
              <span className="text-gray-400 font-normal">(optional — auto-generated if empty)</span>
            </label>
            <textarea
              name="excerpt" value={form.excerpt} onChange={handleChange}
              placeholder="A short summary of your post..." rows={2} maxLength={300}
              className="input-field resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Content{" "}
              <span className="text-gray-400 font-normal">(required to publish)</span>
            </label>
            <textarea
              name="content" value={form.content} onChange={handleChange}
              placeholder="Write your post content here..." rows={12}
              className="input-field resize-y"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing || drafting || !form.title || !form.content || form.content.length < 20}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {publishing ? <span className="spinner" /> : <BookOpen size={16} />}
              Publish Post
            </button>

            <button
              type="button"
              onClick={handleDraft}
              disabled={publishing || drafting || !form.title}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium border transition-all disabled:opacity-50"
              style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
            >
              {drafting ? <span className="spinner" style={{ borderTopColor: "var(--primary)" }} /> : <Save size={16} />}
              Save as Draft
            </button>

            <Link to="/" className="btn-outline">Cancel</Link>
          </div>

          <p className="text-xs text-gray-400">
            Drafts are only visible to you. You can publish them later from{" "}
            <Link to="/my-posts" className="underline" style={{ color: "var(--primary)" }}>
              My Posts
            </Link>.
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePost;
