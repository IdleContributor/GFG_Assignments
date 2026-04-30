import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import ForgotPassword from "./pages/ForgotPassword";
import MyPosts from "./pages/MyPosts";
import NotFound from "./pages/NotFound";

function App() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = not logged in
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage");
        setUser(null); // Set to null if parsing fails
      }
    } else {
      setUser(null); // Set to null if no stored user
    }
  }, []);

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    showToast("Logged out successfully");
  };

  return (
    <Router basename="/a10">
      <div className="min-h-screen text-gray-900 font-sans" style={{ backgroundColor: "var(--bg)" }}>
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />
        <Navbar user={user} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/signup" element={<Signup onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/posts/:id" element={<PostDetail user={user} />} />
            <Route path="/create" element={<CreatePost user={user} />} />
            <Route path="/edit/:id" element={<EditPost user={user} />} />
            <Route path="/my-posts" element={<MyPosts user={user} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
