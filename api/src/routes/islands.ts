import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.ts";
import {
	deleteIsland,
	editIsland,
	setUpIsland,
	viewIsland,
} from "../controllers/islandController.ts";
import { getUserTrinkets } from "../controllers/trinketController.ts";
import { getUserPosts } from "../controllers/postController.ts";

const IslandRouter = Router();

IslandRouter.get("/:username", requireAuth, viewIsland);
IslandRouter.post("/:username", requireAuth, setUpIsland);
IslandRouter.patch("/:username", requireAuth, editIsland);
IslandRouter.delete("/:username", requireAuth, deleteIsland);

IslandRouter.get("/:username/trinkets", requireAuth, getUserTrinkets);
IslandRouter.get("/:username/posts", requireAuth, getUserPosts);

export default IslandRouter;
