import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import api from "../utils/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // "email" | "reset" | "done"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/v1/forgot-password", { email });
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResent(false);
    setError("");
    try {
      await api.post("/auth/v1/forgot-password", { email });
      setResent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend");
    } finally {
      setResending(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length !== 6) { setError("Enter the 6-digit code"); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      await api.post("/auth/v1/reset-password", { email, otp, newPassword });
      setStep("done");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-bold text-gray-900">Reset password</h2>
          <p className="text-gray-500 text-sm">
            {step === "email" && "Enter your email to receive a reset code"}
            {step === "reset" && `Enter the code sent to ${email}`}
            {step === "done" && "Password updated successfully"}
          </p>
        </div>

        <AnimatePresence mode="wait">

          {/* Step 1 — Email */}
          {step === "email" && (
            <motion.form
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSendOtp}
              className="space-y-4"
            >
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </div>
              )}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email address</label>
                <div className="input-wrapper">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" required className="input-field has-icon"
                    autoFocus
                  />
                </div>
              </div>
              <button
                type="submit" disabled={loading}
                className="btn-primary w-full flex justify-center items-center gap-2 disabled:opacity-60"
              >
                {loading ? <span className="spinner" /> : "Send Reset Code"}
              </button>
              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft size={14} /> Back to login
              </Link>
            </motion.form>
          )}

          {/* Step 2 — OTP + new password */}
          {step === "reset" && (
            <motion.form
              key="reset"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleReset}
              className="space-y-4"
            >
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
                <label className="text-sm font-medium text-gray-700">Verification code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="input-field text-center text-2xl font-bold"
                  style={{ letterSpacing: "0.4em" }}
                  autoFocus
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">New password</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input
                    type="password" value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters" required minLength={6}
                    className="input-field has-icon"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Confirm new password</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input
                    type="password" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password" required
                    className="input-field has-icon"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={loading || otp.length !== 6}
                className="btn-primary w-full flex justify-center items-center gap-2 disabled:opacity-60"
              >
                {loading ? <span className="spinner" /> : "Reset Password"}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button" onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                  className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft size={14} /> Change email
                </button>
                <button
                  type="button" onClick={handleResend} disabled={resending}
                  className="font-medium hover:underline disabled:opacity-50"
                  style={{ color: "var(--primary)" }}
                >
                  {resending ? "Sending..." : "Resend code"}
                </button>
              </div>
            </motion.form>
          )}

          {/* Done */}
          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-3 py-4"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: "var(--primary-light)" }}
              >
                <CheckCircle size={32} style={{ color: "var(--primary)" }} />
              </div>
              <p className="font-semibold text-gray-800">Password updated!</p>
              <p className="text-sm text-gray-500">Redirecting to login...</p>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
