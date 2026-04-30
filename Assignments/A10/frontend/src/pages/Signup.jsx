import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, AlertCircle, CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import api from "../utils/api";

// ── Step 1: Fill in details + send OTP ───────────────────────────────────────
const StepDetails = ({ onOtpSent }) => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/v1/send-otp", { email: form.email });
      onOtpSent(form);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSendOtp} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Username</label>
        <div className="input-wrapper">
          <User size={16} className="input-icon" />
          <input
            type="text" name="username" value={form.username} onChange={handleChange}
            placeholder="johndoe" required minLength={3} className="input-field has-icon"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <div className="input-wrapper">
          <Mail size={16} className="input-icon" />
          <input
            type="email" name="email" value={form.email} onChange={handleChange}
            placeholder="you@example.com" required className="input-field has-icon"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <div className="input-wrapper relative">
          <Lock size={16} className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Min. 6 characters"
            required
            minLength={6}
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
        {loading ? <span className="spinner" /> : "Sign Up"}
      </button>
    </form>
  );
};

// ── Step 2: Enter OTP ─────────────────────────────────────────────────────────
const StepOtp = ({ formData, onBack, onSuccess }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) { setError("Enter the 6-digit code"); return; }
    setLoading(true);
    try {
      await api.post("/auth/v1/register", { ...formData, otp });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResent(false);
    setError("");
    try {
      await api.post("/auth/v1/send-otp", { email: formData.email });
      setResent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-4">
      <div className="text-center space-y-1 pb-2">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: "var(--primary-light)" }}
        >
          <Mail size={22} style={{ color: "var(--primary)" }} />
        </div>
        <p className="text-sm text-gray-600">
          We sent a 6-digit code to <strong>{formData.email}</strong>
        </p>
        <p className="text-xs text-gray-400">It expires in 10 minutes</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {resent && (
        <div className="bg-green-50 border border-green-100 text-green-600 p-3 rounded-lg flex items-center gap-2 text-sm">
          <CheckCircle size={16} className="shrink-0" />
          New code sent!
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Verification Code</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          maxLength={6}
          className="input-field text-center text-2xl tracking-[0.5em] font-bold"
          style={{ letterSpacing: "0.4em" }}
          autoFocus
        />
      </div>

      <button
        type="submit" disabled={loading || otp.length !== 6}
        className="btn-primary w-full flex justify-center items-center gap-2 disabled:opacity-60"
      >
        {loading ? <span className="spinner" /> : "Verify & Create Account"}
      </button>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button" onClick={onBack}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft size={14} /> Change details
        </button>
        <button
          type="button" onClick={handleResend} disabled={resending}
          className="font-medium hover:underline disabled:opacity-50"
          style={{ color: "var(--primary)" }}
        >
          {resending ? "Sending..." : "Resend code"}
        </button>
      </div>
    </form>
  );
};

// ── Main Signup component ─────────────────────────────────────────────────────
const Signup = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState("details"); // "details" | "otp" | "done"
  const [formData, setFormData] = useState(null);
  const [googleError, setGoogleError] = useState("");

  const handleOtpSent = (data) => {
    setFormData(data);
    setStep("otp");
  };

  const handleRegistered = () => {
    setStep("done");
    setTimeout(() => navigate("/login"), 2000);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleError("");
    try {
      const res = await api.post("/auth/v1/google", {
        credential: credentialResponse.credential,
      });
      const { user, token } = res.data.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      if (onLoginSuccess) onLoginSuccess(user);
      navigate("/");
    } catch (err) {
      setGoogleError(err.response?.data?.message || "Google sign-in failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
          <p className="text-gray-500 text-sm">Join BlogSpace and start writing</p>
        </div>

        {/* Success state */}
        {step === "done" ? (
          <div className="text-center space-y-3 py-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: "var(--primary-light)" }}
            >
              <CheckCircle size={32} style={{ color: "var(--primary)" }} />
            </div>
            <p className="font-semibold text-gray-800">Account created!</p>
            <p className="text-sm text-gray-500">Redirecting to login...</p>
          </div>
        ) : (
          <>
            {/* Google sign-up */}
            {googleError && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                {googleError}
              </div>
            )}

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setGoogleError("Google sign-in failed")}
              text="signup_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="100%"
            />

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">or sign up with email</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              {step === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <StepDetails onOtpSent={handleOtpSent} />
                </motion.div>
              )}
              {step === "otp" && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <StepOtp
                    formData={formData}
                    onBack={() => setStep("details")}
                    onSuccess={handleRegistered}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="font-medium hover:underline" style={{ color: "var(--primary)" }}>
                Sign in
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Signup;
