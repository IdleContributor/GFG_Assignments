import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import productsRouter from "../routes/products.routes.js";
import errorMiddleware from "../middleware/error.middle.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// Serve static files from public/
app.use(express.static(join(__dirname, "../public")));

app.use(express.json()); // parse JSON request bodies

// ==========================================
// REQUEST LOGGER MIDDLEWARE
// Logs every request with timestamp, method, and URL.
// Same pattern as 6.nodejs/middleware.js
// ==========================================
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// ROUTES
// ==========================================
app.use("/api/products", productsRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// ==========================================
// 404 HANDLER
// Catches any API route that doesn't match above
// Only for /api routes to not interfere with static files
// ==========================================
app.use((req, res, next) => {
  // Only send 404 JSON for API routes
  if (req.url.startsWith('/api')) {
    res.status(404).json({ success: false, message: `Route ${req.url} not found` });
  } else {
    // For non-API routes, let static middleware handle it or fall through
    next();
  }
});

// ==========================================
// GLOBAL ERROR HANDLER
// Must be last — 4 params signals Express this is an error handler
// ==========================================
app.use(errorMiddleware);

export default app;
