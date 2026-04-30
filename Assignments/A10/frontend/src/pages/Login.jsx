import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import api from "../utils/api";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/v1/login", { email, password });
      const { user, token } = response.data.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      onLoginSuccess(user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      const res = await api.post("/auth/v1/google", {
        credential: credentialResponse.credential,
      });
      const { user, token } = res.data.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      onLoginSuccess(user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Google sign-in failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 space-y-6"
      >
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-gray-500 text-sm">Sign in to your BlogSpace account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Google login */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google sign-in failed")}
          text="signin_with"
          shape="rectangular"
          theme="outline"
          size="large"
          width="100%"
        />

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 font-medium">or sign in with email</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Email/password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="input-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required className="input-field has-icon"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs hover:underline"
                style={{ color: "var(--primary)" }}
              >
                Forgot password?
              </Link>
            </div>
            <div className="input-wrapper relative">
              <Lock size={16} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input-field has-icon pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="btn-primary w-full flex justify-center items-center gap-2 disabled:opacity-60"
          >
            {loading ? <span className="spinner" /> : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-medium hover:underline" style={{ color: "var(--primary)" }}>
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
