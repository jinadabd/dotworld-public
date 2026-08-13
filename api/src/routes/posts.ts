import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.ts";
import { composePost, editPost, deletePost, getPost } from "../controllers/postController.ts";

export const composeRouter = Router();
composeRouter.post("/", requireAuth, composePost);

export const postsRouter = Router();
// postsRouter.post("/:postId", requireAuth, interaction: reply or like);
postsRouter.get("/:postId", requireAuth, getPost);
postsRouter.patch("/:postId", requireAuth, editPost);
postsRouter.delete("/:postId", requireAuth, deletePost);
