import { Link } from "react-router-dom";
import { BookOpen, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }} className="border-t mt-16 transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col items-center gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold"
            style={{ color: "var(--primary)" }}
          >
            <BookOpen size={20} />
            <span>BlogSpace</span>
          </Link>

          {/* Copyright */}
          <p className="text-sm text-gray-500 text-center">
            Built to fulfill GeeksforGeeks Assignment-10 Requirements
          </p>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-800 transition-colors">
              Home
            </Link>
            <Link to="/my-posts" className="text-gray-500 hover:text-gray-800 transition-colors">
              My Posts
            </Link>
            <Link to="/create" className="text-gray-500 hover:text-gray-800 transition-colors">
              Create Post
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
