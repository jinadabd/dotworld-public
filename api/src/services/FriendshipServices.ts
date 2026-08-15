import { ServerError, ServerErrorCode } from "../errors/ServerError.ts";
import {
	acceptUserFriendship,
	cancelFriendship,
	createFriendship,
	deleteFriendship,
	getAllUserFriends,
	getFriendship,
	getFriendshipStatus,
} from "../models/Friendships.ts";
import { FriendshipStatus, type FriendshipRow } from "../types/types.ts";

// ================= CREATE ===================

export async function createFriendshipService(
	userId: number,
	friendId: number,
): Promise<FriendshipRow> {
	if (userId === friendId)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "createFriendshipService");
	const friendship = await getFriendshipStatus(userId, friendId);
	if (friendship) throw new ServerError(ServerErrorCode.INVALID_INPUT, "createFriendshipService");

	return await createFriendship(userId, friendId);
}

// ================= GET ===================

export async function getFriendshipService(
	userId: number,
	friendId: number,
): Promise<FriendshipRow | null> {
	return await getFriendshipStatus(userId, friendId);
}

export async function getAllUserFriendshipsService(userId: number): Promise<FriendshipRow[]> {
	return await getAllUserFriends(userId);
}

// ================= UPDATE ===================

export async function acceptFriendshipService(
	acceptingId: number,
	requestingId: number,
): Promise<FriendshipRow> {
	const friendship = await getFriendship(acceptingId, requestingId);
	if (
		!friendship ||
		friendship.friendship_status === FriendshipStatus.friends ||
		friendship.friend_id !== acceptingId
	)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "acceptFriendshipService");

	return await acceptUserFriendship(acceptingId, requestingId);
}

export async function cancelFriendshipService(
	cancellingId: number,
	friendId: number,
): Promise<FriendshipRow> {
	const friendship = await getFriendship(cancellingId, friendId);
	if (
		!friendship ||
		friendship.friendship_status === FriendshipStatus.friends ||
		friendship.user_id !== cancellingId
	)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "cancelFriendshipService");

	return await cancelFriendship(cancellingId, friendId);
}

// ================= DELETE ===================

export async function deleteFriendshipService(
	userId: number,
	friendId: number,
): Promise<FriendshipRow> {
	const friendship = await getFriendship(userId, friendId);
	if (!friendship || friendship.friendship_status !== FriendshipStatus.friends)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "deleteFriendshipService");

	return await deleteFriendship(userId, friendId);
}

// ================= REQUIRES ===================

export async function requireFriendship(firstId: number, secondId: number) {
	const friendship = await getFriendshipStatus(firstId, secondId);
	if (!friendship || friendship.friendship_status !== FriendshipStatus.friends)
		throw new ServerError(ServerErrorCode.ACCESS_DENIED, "requireFriendship");
}
