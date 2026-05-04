import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";

// Load .env locally; on Railway/Render env vars are injected directly
// Only load from file if it exists (local development)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: "./env/.env" });
}

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Blog API server is running on port ${PORT}`);

  
  // Keep-alive ping to prevent Railway from sleeping
  if (process.env.NODE_ENV === 'production' && process.env.RAILWAY_PUBLIC_DOMAIN) {
    const url = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/api/health`;
    setInterval(async () => {
      try {
        await fetch(url);
        console.log('Keep-alive ping sent');
      } catch (err) {
        console.log('Keep-alive ping failed:', err.message);
      }
    }, 5 * 60 * 1000); // ping every 5 minutes
  }
  
});
