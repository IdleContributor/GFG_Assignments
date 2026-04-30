/**
 * Assignment 7 — Node.js Simple Server
 * =====================================
 *
 * CONCEPTS PRACTICED:
 * - http module: createServer, req, res
 * - fs module: readFile to serve static HTML
 * - path module: resolve file paths safely
 * - Request logging with timestamps
 * - Manual routing (no Express)
 * - 404 handling for unknown routes
 * - nodemon for live reload during development
 *
 * ROUTES:
 * GET /          → serves public/index.html
 * GET /about     → serves public/about.html
 * GET /contact   → serves public/contact.html
 * GET /styles.css → serves public/styles.css
 * *              → 404 page
 *
 * RUN:
 * npm start  (uses nodemon for live reload)
 */

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ==========================================
// PATH SETUP
// ==========================================
// __dirname is not available in ES modules — reconstruct it
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const PORT   = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, "public"); // folder with HTML/CSS files

// ==========================================
// LOGGER UTILITY
// ==========================================
// Logs every incoming request with a timestamp, method, and URL.
// Mirrors the pattern from 6.nodejs/express.js and middleware.js.
const logRequest = (req) => {
  const timestamp = new Date().toISOString();
  const method    = req.method;
  const url       = req.url;
  const log       = `[${timestamp}] ${method} ${url}`;

  console.log(log);

  // Also append to a log file so logs persist across restarts
  fs.appendFile(
    path.join(__dirname, "requests.log"),
    log + "\n",
    (err) => {
      if (err) console.error("Logger error:", err);
    }
  );
};

// ==========================================
// MIME TYPE HELPER
// ==========================================
// Returns the correct Content-Type header for a given file extension.
const getMimeType = (filePath) => {
  const ext = path.extname(filePath);
  const types = {
    ".html": "text/html",
    ".css":  "text/css",
    ".js":   "text/javascript",
    ".json": "application/json",
    ".png":  "image/png",
    ".jpg":  "image/jpeg",
    ".ico":  "image/x-icon",
  };
  return types[ext] || "text/plain";
};

// ==========================================
// SERVE FILE HELPER
// ==========================================
// Reads a file from disk and writes it to the response.
// Sends a 404 if the file doesn't exist.
const serveFile = (res, filePath, statusCode = 200) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // File not found — serve the 404 page instead
      fs.readFile(path.join(PUBLIC, "404.html"), (err404, data404) => {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(err404 ? "<h1>404 - Not Found</h1>" : data404);
      });
      return;
    }
    res.writeHead(statusCode, { "Content-Type": getMimeType(filePath) });
    res.end(data);
  });
};

// ==========================================
// HTTP SERVER
// ==========================================
const server = http.createServer((req, res) => {
  // Log every request first
  logRequest(req);

  // Strip query strings from the URL for clean routing
  const url = req.url.split("?")[0];

  // Route to the correct file based on the URL
  if (url === "/") {
    serveFile(res, path.join(PUBLIC, "index.html"));
  } else if (url === "/about") {
    serveFile(res, path.join(PUBLIC, "about.html"));
  } else if (url === "/contact") {
    serveFile(res, path.join(PUBLIC, "contact.html"));
  } else if (url === "/styles.css") {
    serveFile(res, path.join(PUBLIC, "styles.css"));
  } else {
    // Unknown route — serve 404 page
    serveFile(res, path.join(PUBLIC, "404.html"), 404);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("Logging requests to requests.log");
  console.log("Press Ctrl+C to stop\n");
});