import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium"
          style={{
            backgroundColor: isSuccess ? "var(--primary)" : "#ef4444",
            color: "#fff",
            minWidth: "260px",
            maxWidth: "90vw",
          }}
        >
          {isSuccess ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span className="flex-1">{message}</span>
          <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
