import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import seedBooks from "./utils/seeder.utils.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB, seed sample data if empty, then start server
connectDB().then(() => seedBooks());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
