import { ServerError, ServerErrorCode } from "../errors/ServerError.ts";
import {
	acceptUserFriendship,
	cancelFriendship,
	createFriendship,
	deleteFriendship,
	getAllPendingFriendships,
	getAllUserFriends,
	getFriendship,
	getFriendshipStatus,
	rejectFriendship,
} from "../models/Friendships.ts";
import { ChangeStatusOptions, FriendshipStatus, type FriendshipRow } from "../types/types.ts";

// ================= CREATE ===================

export async function createFriendshipService(
	userId: number,
	friendId: number,
): Promise<FriendshipRow> {
	if (userId === friendId)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "createFriendshipService");
	const friendship = await getFriendshipStatus(userId, friendId);
	if (friendship !== null)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "createFriendshipService");

	return await createFriendship(userId, friendId);
}

// ================= GET ===================

export async function getFriendshipService(
	userId: number,
	friendId: number,
): Promise<FriendshipRow | null> {
	if (!userId || !friendId)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "getFriendshipService");
	return await getFriendship(userId, friendId);
}

export async function getAllUserFriendshipsService(userId: number): Promise<FriendshipRow[]> {
	return await getAllUserFriends(userId);
}

export async function getFriendshipRequestsService(userId: number): Promise<FriendshipRow[]> {
	return await getAllPendingFriendships(userId);
}

// ================= UPDATE ===================

export async function changeFriendshipStatusService(
	initiatingId: number,
	userId: number,
	change: ChangeStatusOptions,
): Promise<FriendshipRow> {
	if (change === ChangeStatusOptions.accept)
		return await acceptFriendshipRequest(initiatingId, userId);
	else if (change === ChangeStatusOptions.reject)
		return await rejectFriendshipRequest(initiatingId, userId);
	else if (change === ChangeStatusOptions.cancel)
		return await cancelFriendshipRequest(initiatingId, userId);
	throw new ServerError(ServerErrorCode.INVALID_INPUT, "acceptFriendshipService");
}

async function acceptFriendshipRequest(
	acceptingId: number,
	requestingId: number,
): Promise<FriendshipRow> {
	const friendship = await getFriendshipStatus(acceptingId, requestingId);
	if (
		!friendship ||
		friendship.friendship_status === FriendshipStatus.friends ||
		friendship.friend_id !== acceptingId
	)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "acceptFriendshipService");

	return await acceptUserFriendship(acceptingId, requestingId);
}

async function rejectFriendshipRequest(
	rejectingId: number,
	requestingId: number,
): Promise<FriendshipRow> {
	const friendship = await getFriendshipStatus(rejectingId, requestingId);
	if (
		!friendship ||
		friendship.friendship_status === FriendshipStatus.friends ||
		friendship.user_id !== requestingId
	)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "cancelFriendshipService");

	return await rejectFriendship(rejectingId, requestingId);
}

async function cancelFriendshipRequest(
	cancellingId: number,
	friendId: number,
): Promise<FriendshipRow> {
	const friendship = await getFriendshipStatus(cancellingId, friendId);
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
	const friendship = await getFriendship(firstId, secondId);
	if (!friendship || friendship.friendship_status !== FriendshipStatus.friends)
		throw new ServerError(ServerErrorCode.ACCESS_DENIED, "requireFriendship");
}
