import express from "express";
import { getAllPosts } from "../controllers/post/getAllPosts.controller.js";
import { getPostById } from "../controllers/post/getPostById.controller.js";
import { getMyPosts } from "../controllers/post/getMyPosts.controller.js";
import { createPost } from "../controllers/post/createPost.controller.js";
import { updatePost } from "../controllers/post/updatePost.controller.js";
import { deletePost } from "../controllers/post/deletePost.controller.js";
import { likePost } from "../controllers/post/likePost.controller.js";
import { publishPost } from "../controllers/post/publishPost.controller.js";
import verifyToken from "../middleware/verifyToken.middle.js";

const postRouter = express.Router();

// Public
postRouter.get("/", getAllPosts);

// Protected — must come before /:id so Express doesn't treat "user" as an id
postRouter.get("/user/me", verifyToken, getMyPosts);

// Public (single post)
postRouter.get("/:id", getPostById);

// Protected
postRouter.post("/", verifyToken, createPost);
postRouter.put("/:id", verifyToken, updatePost);
postRouter.delete("/:id", verifyToken, deletePost);
postRouter.patch("/:id/like", verifyToken, likePost);
postRouter.patch("/:id/publish", verifyToken, publishPost);

export default postRouter;
