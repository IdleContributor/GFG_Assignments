import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "../routes/auth.routes.js";
import postRouter from "../routes/post.routes.js";
import errorMiddleware from "../middleware/error.middle.js";

dotenv.config({ path: "./env/.env" });

const app = express();

// Middleware
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.CLIENT_URL]
  : ['http://localhost:5173', 'http://localhost:3000', process.env.CLIENT_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(undefined)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth/v1", authRouter);
app.use("/api/posts/v1", postRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Blog API is running" });
});

// Global error handler (must be last)
app.use(errorMiddleware);

export default app;
