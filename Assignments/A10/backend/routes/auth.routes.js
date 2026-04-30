import express from "express";
import { register } from "../controllers/auth/register.controller.js";
import { login } from "../controllers/auth/login.controller.js";
import { logout } from "../controllers/auth/logout.controller.js";
import { sendOtp } from "../controllers/auth/sendOtp.controller.js";
import { googleAuth } from "../controllers/auth/googleAuth.controller.js";
import { forgotPasswordSendOtp, resetPassword } from "../controllers/auth/forgotPassword.controller.js";
import { loginLimiter } from "../config/rateLimit.config.js";

const authRouter = express.Router();

authRouter.post("/send-otp", sendOtp);
authRouter.post("/register", register);
authRouter.post("/login", loginLimiter, login);
authRouter.post("/google", googleAuth);
authRouter.post("/logout", logout);
authRouter.post("/forgot-password", forgotPasswordSendOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
