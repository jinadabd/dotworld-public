import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.ts";
import { composePost, editPost, deletePost, getPost } from "../controllers/postController.ts";

export const ComposeRouter = Router();
ComposeRouter.post("/", requireAuth, composePost);

export const PostsRouter = Router();
// PostsRouter.post("/:postId", requireAuth, interaction: reply or like);
PostsRouter.get("/:postId", requireAuth, getPost);
PostsRouter.patch("/:postId", requireAuth, editPost);
PostsRouter.delete("/:postId", requireAuth, deletePost);
