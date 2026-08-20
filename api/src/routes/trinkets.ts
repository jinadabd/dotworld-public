import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.ts";
import {
	createTrinket,
	deleteTrinket,
	editTrinket,
	getCommunityTrinkets,
	getFriendsTrinkets,
	getTrinket,
} from "../controllers/trinketController.ts";
import {
	createTrinketItem,
	deleteTrinketItem,
	getTrinketItem,
} from "../controllers/trinketItemController.ts";

const TrinketRouter = Router();

TrinketRouter.get("/community", requireAuth, getCommunityTrinkets);
TrinketRouter.get("/friends", requireAuth, getFriendsTrinkets);

TrinketRouter.post("/", requireAuth, createTrinket);
TrinketRouter.get("/:trinketId", requireAuth, getTrinket);
TrinketRouter.patch("/:trinketId", requireAuth, editTrinket);
TrinketRouter.delete("/:trinketId", requireAuth, deleteTrinket);

TrinketRouter.post("/:trinketId", requireAuth, createTrinketItem);
TrinketRouter.get("/:trinketId/:trinketItemId", requireAuth, getTrinketItem);
TrinketRouter.delete("/:trinketId/:trinketItemId", requireAuth, deleteTrinketItem);

export default TrinketRouter;
