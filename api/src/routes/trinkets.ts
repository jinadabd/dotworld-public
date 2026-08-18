import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.ts";
import {
	createTrinket,
	deleteTrinket,
	editTrinket,
	getCommunityTrinkets,
	getTrinket,
} from "../controllers/trinketController.ts";
import {
	createTrinketItem,
	deleteTrinketItem,
	getTrinketItem,
} from "../controllers/trinketItemController.ts";

const TrinketRouter = Router();

TrinketRouter.post("/", requireAuth, createTrinket);
TrinketRouter.get("/:trinketId", requireAuth, getTrinket);
TrinketRouter.patch("/:trinketId", requireAuth, editTrinket);
TrinketRouter.delete("/:trinketId", requireAuth, deleteTrinket);

TrinketRouter.post("/:trinketId", requireAuth, createTrinketItem);
TrinketRouter.get("/:trinketId/:trinketItemId", requireAuth, getTrinketItem);
TrinketRouter.delete("/:trinketId/:trinketItemId", requireAuth, deleteTrinketItem);

TrinketRouter.get("/community", requireAuth, getCommunityTrinkets);

export default TrinketRouter;
