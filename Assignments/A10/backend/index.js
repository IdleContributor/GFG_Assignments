import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";

// Load .env locally; on Render env vars are injected directly
dotenv.config({ path: "./env/.env" });

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Blog API server is running on port ${PORT}`);
});
