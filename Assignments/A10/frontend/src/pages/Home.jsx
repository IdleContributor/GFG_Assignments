import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, PenSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import PostCard from "../components/PostCard";

const CATEGORIES = ["All", "Technology", "Lifestyle", "Travel", "Food", "Health", "Education", "Other"];

const Home = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  // key changes whenever category/search/page changes — triggers AnimatePresence exit+enter
  const [gridKey, setGridKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 9 };
        if (category !== "All") params.category = category;
        if (search) params.search = search;
        const res = await api.get("/posts/v1", { params });
        if (!cancelled) {
          setPosts(res.data.data);
          setPagination(res.data.pagination);
          setGridKey((k) => k + 1); // new key = fresh animation
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPosts();
    return () => { cancelled = true; };
  }, [category, search, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Welcome to{" "}
          <span style={{ color: "var(--primary)" }}>BlogSpace</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Discover stories, ideas, and perspectives from writers on any topic.
        </p>
        {user ? (
          <Link to="/create" className="btn-primary inline-flex items-center gap-2">
            <PenSquare size={18} />
            Write a Post
          </Link>
        ) : (
          <Link to="/signup" className="btn-primary inline-flex items-center gap-2">
            Get Started — It&apos;s Free
          </Link>
        )}
      </motion.section>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
        <div className="input-wrapper flex-1">
          <Search size={18} className="input-icon" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input-field has-icon w-full"
          />
        </div>
        <button type="submit" className="btn-primary shrink-0">
          Search
        </button>
      </form>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all border"
            style={
              category === cat
                ? { backgroundColor: "var(--primary)", color: "#fff", borderColor: "var(--primary)" }
                : { backgroundColor: "#fff", color: "#4b5563", borderColor: "#e5e7eb" }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts area — fixed min-height prevents layout jump */}
      <div className="min-h-[400px]">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-48"
          >
            <div
              className="animate-spin rounded-full h-10 w-10 border-t-2"
              style={{ borderColor: "var(--primary)" }}
            />
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-gray-400"
          >
            <p className="text-lg">No posts found.</p>
            {user && (
              <Link to="/create" className="btn-primary mt-4 inline-block">
                Be the first to write one!
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
                <PostCard key={post._id} post={post} />
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

export default Home;
