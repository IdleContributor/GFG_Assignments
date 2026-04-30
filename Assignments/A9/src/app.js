import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import booksRouter from "../routes/books.routes.js";
import errorMiddleware from "../middleware/error.middle.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// Serve static files from public/
app.use(express.static(join(__dirname, "../public")));

app.use(express.json()); // parse JSON request bodies

// ==========================================
// REQUEST LOGGER MIDDLEWARE
// ==========================================
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// ROUTES
// ==========================================
app.use("/api/books", booksRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// ==========================================
// 404 HANDLER
// ==========================================
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.url} not found` });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================
app.use(errorMiddleware);

export default app;
