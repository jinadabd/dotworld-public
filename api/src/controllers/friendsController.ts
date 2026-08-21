import type { Request, Response } from "express";
import {
	changeFriendshipStatusService,
	createFriendshipService,
	deleteFriendshipService,
	getAllUserFriendshipsService,
	getFriendshipPendingRequestsService,
	getFriendshipService,
} from "../services/FriendshipServices.ts";
import type { ChangeStatusOptions } from "../types/types.ts";

export async function addFriend(req: Request<{ friendId: string }>, res: Response) {
	const userId = (req as any).userId;
	const friendId = Number.parseInt(req.params.friendId, 10);
	const friendRequest = await createFriendshipService(userId, friendId);
	res.status(201).json(friendRequest);
}

export async function getFriendship(req: Request<{ friendId: string }>, res: Response) {
	const userId = (req as any).userId;
	const friendId = Number.parseInt(req.params.friendId, 10);
	const friendship = await getFriendshipService(userId, friendId);
	res.status(200).json(friendship);
}

export async function getAllFriends(req: Request, res: Response) {
	const userId = (req as any).userId;
	const friends = await getAllUserFriendshipsService(userId);
	res.status(200).json(friends);
}

export async function getRequestsFriendships(req: Request, res: Response) {
	const userId = (req as any).userId;
	const requests = await getFriendshipPendingRequestsService(userId, "requests");
	res.status(200).json(requests);
}

export async function getPendingFriendships(req: Request, res: Response) {
	const userId = (req as any).userId;
	const pending = await getFriendshipPendingRequestsService(userId, "pending");
	res.status(200).json(pending);
}

export async function changeFriendshipStatus(
	req: Request<{ friendId: string }, {}, { change: ChangeStatusOptions }>,
	res: Response,
) {
	const userId = (req as any).userId;
	const friendId = Number.parseInt(req.params.friendId, 10);
	const change = req.body.change as ChangeStatusOptions;
	const friendship = await changeFriendshipStatusService(userId, friendId, change);
	res.status(200).json(friendship);
}

export async function removeFriend(req: Request<{ friendId: string }>, res: Response) {
	const userId = (req as any).userId;
	const friendId = Number.parseInt(req.params.friendId, 10);
	const friendship = await deleteFriendshipService(userId, friendId);
	res.status(200).json(friendship);
}
