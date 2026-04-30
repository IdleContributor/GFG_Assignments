import { Link, useNavigate, useLocation } from "react-router-dom";
import { PenSquare, LogOut, LogIn, UserPlus, BookOpen, LayoutList, Moon, Sun } from "lucide-react";
import api from "../utils/api";

const Navbar = ({ user, onLogout, darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    try {
      await api.post("/auth/v1/logout");
    } catch (e) {
      // ignore
    }
    onLogout();
    navigate("/");
  };

  const navLink = (to) =>
    pathname === to
      ? { color: "var(--primary)", fontWeight: 600 }
      : {};

  return (
    <nav style={{ backgroundColor: "var(--nav-bg)", borderColor: "var(--border)" }} className="border-b sticky top-0 z-50 shadow-sm transition-colors">
      <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold shrink-0"
          style={{ color: "var(--primary)" }}
        >
          <BookOpen size={24} />
          <span>BlogSpace</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <>
              {/* My Posts link */}
              <Link
                to="/my-posts"
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
                style={navLink("/my-posts")}
              >
                <LayoutList size={16} />
                <span className="hidden sm:inline">My Posts</span>
              </Link>

              <span className="hidden md:block text-sm text-gray-400">
                Hi,{" "}
                <span className="font-semibold text-gray-800">{user.username}</span>
              </span>

              <Link to="/create" className="btn-primary flex items-center gap-1.5 text-sm">
                <PenSquare size={16} />
                <span className="hidden sm:inline">New Post</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline flex items-center gap-1.5 text-sm">
                <LogIn size={16} />
                Login
              </Link>
              <Link to="/signup" className="btn-primary flex items-center gap-1.5 text-sm">
                <UserPlus size={16} />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
