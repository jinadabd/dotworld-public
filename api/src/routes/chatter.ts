import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.ts";
import { getChatter } from "../controllers/postController.ts";

const ChatterRouter = Router();

ChatterRouter.get("/", requireAuth, getChatter);

export default ChatterRouter;
