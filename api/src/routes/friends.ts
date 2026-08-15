import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.ts";
import {
	addFriend,
	changeFriendshipStatus,
	getAllFriends,
	getFriendship,
	removeFriend,
} from "../controllers/friendsController.ts";

const FriendsRouter = Router();

FriendsRouter.get("/", requireAuth, getAllFriends);
FriendsRouter.get("/:friendId", requireAuth, getFriendship);

FriendsRouter.post("/:friendId", requireAuth, addFriend);

FriendsRouter.patch("/:friendId", requireAuth, changeFriendshipStatus);

FriendsRouter.delete("/:friendId", requireAuth, removeFriend);

export default FriendsRouter;
