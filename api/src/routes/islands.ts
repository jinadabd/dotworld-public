import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.ts";
import {
	deleteIsland,
	editIsland,
	setUpIsland,
	viewIsland,
} from "../controllers/islandController.ts";

const IslandRouter = Router();

IslandRouter.get("/:username", requireAuth, viewIsland);
IslandRouter.post("/:username", requireAuth, setUpIsland);
IslandRouter.patch("/:username", requireAuth, editIsland);
IslandRouter.delete("/:username", requireAuth, deleteIsland);

export default IslandRouter;
