import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-24 space-y-4"
    >
      <h1 className="text-8xl font-bold" style={{ color: "var(--primary-light)" }}>404</h1>
      <h2 className="text-2xl font-bold text-gray-800">Page Not Found</h2>
      <p className="text-gray-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="btn-primary inline-block mt-4">
        Go Home
      </Link>
    </motion.div>
  );
};

export default NotFound;
