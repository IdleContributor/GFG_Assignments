import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "./models/post.model.js";

dotenv.config({ path: "./env/.env" });

const checkPosts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const allPosts = await Post.find({}).select("title status author");
    console.log(`\n📊 Total posts in database: ${allPosts.length}\n`);

    const published = allPosts.filter(p => p.status === "published");
    const drafts = allPosts.filter(p => p.status === "draft");

    console.log(`✅ Published posts: ${published.length}`);
    console.log(`📝 Draft posts: ${drafts.length}\n`);

    if (drafts.length > 0) {
      console.log("Draft posts:");
      drafts.forEach(post => {
        console.log(`  - ${post.title} (${post.status})`);
      });
    }

    if (published.length > 0) {
      console.log("\nPublished posts:");
      published.forEach(post => {
        console.log(`  - ${post.title} (${post.status})`);
      });
    }

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

checkPosts();
