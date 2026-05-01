import app from "./src/app.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Starting A8 Express server...");
console.log("Current directory:", process.cwd());
console.log("__dirname:", __dirname);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✓ Products API: http://localhost:${PORT}/api/products`);
});
