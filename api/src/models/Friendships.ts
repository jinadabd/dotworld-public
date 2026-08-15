import pool from "../config/postgres.ts";
import { FriendshipStatus, type FriendshipRow } from "../types/types.ts";
import { translatePostgresError } from "../errors/PostgresError.ts";

// ==================== CREATE ====================

/**
 *
 * @param userId - SENT THE REQ
 * @param friendId - THE ONE WHO APPROVES / REJECTS
 * @returns
 */
export async function createFriendship(userId: number, friendId: number): Promise<FriendshipRow> {
	try {
		const result = await pool.query<FriendshipRow>(
			`INSERT INTO friendships(user_id, friend_id)
             VALUES ($1, $2)
             RETURNING *`,
			[userId, friendId],
		);

		const friendship = result.rows[0];
		if (!friendship) translatePostgresError("createFriendship");
		return friendship;
	} catch (err: any) {
		translatePostgresError("createFriendship", err);
	}
}

// ==================== READ ====================

export async function getAllUserFriends(userId: number): Promise<FriendshipRow[]> {
	const result = await pool.query<FriendshipRow>(
		`SELECT *
         FROM friendships
         WHERE (user_id = $1 OR friend_id = $1)
		 AND friendship_status = "friends`,
		[userId],
	);

	const friendships = result.rows;
	if (!friendships) translatePostgresError("getAllUserFriends", undefined, { notFound: true });
	return friendships;
}

export async function getAllPendingFriendships(userId: number): Promise<FriendshipRow[]> {
	const result = await pool.query<FriendshipRow>(
		`SELECT *
         FROM friendships
         WHERE friend_id = $1
		 AND friendship_status = "pending`,
		[userId],
	);

	const friendships = result.rows;
	if (friendships.length === 0)
		translatePostgresError("getAllUserFriends", undefined, { notFound: true });
	return friendships;
}

export async function getFriendship(
	userId: number,
	friendId: number,
): Promise<FriendshipRow | null> {
	const result = await pool.query<FriendshipRow>(
		`SELECT *
         FROM friendships
         WHERE (user_id = $1 AND friend_id = $2)
		 OR (user_id = $2 AND friend_id = $1)
		 AND friendship_status = "friends`,
		[userId, friendId],
	);

	const friendship = result.rows[0];
	// if (!friendship) translatePostgresError("getAllUserFriends", undefined, { notFound: true });
	return friendship ?? null;
}

// ==================== UPDATE ====================

/**
 *
 * @param acceptingId IS THE ONE WHO IS ACCEPTING
 * @param requestingId IS THE ONE WHO SENT THE REQUEST
 * @returns
 */
export async function acceptUserFriendship(
	acceptingId: number,
	requestingId: number,
): Promise<FriendshipRow> {
	const result = await pool.query<FriendshipRow>(
		`UPDATE friendships
         SET friendship_status = "friends"
         WHERE (user_id = $2 AND friend_id = $1)
		 AND friendship_status = "pending"
         RETURNING *`,
		[acceptingId, requestingId],
	);

	const friendships = result.rows[0];
	if (!friendships) translatePostgresError("acceptUserFriendship", undefined, { notFound: true });
	return friendships;
}

// export async function acceptAllFriendships(friendId: number): Promise<FriendshipRow> {
// 	const result = await pool.query<FriendshipRow>(
// 		`UPDATE friendships
//          SET friendship_status = $1
//          WHERE friend_id = $2
// 		 AND friendship_status = "pending"
//          RETURNING *`,
// 		[FriendshipStatus.friends, friendId],
// 	);

// 	const friendships = result.rows[0];
// 	if (!friendships) translatePostgresError("acceptAllFriendships", undefined, { notFound: true });
// 	return friendships;
// }

// ==================== DELETE ====================

/**
 *
 * @param cancellingId - USER WHO REQUESTED, AND IS CANCELLING REQUEST
 * @param friendId
 * @returns
 */
export async function cancelFriendship(
	cancellingId: number,
	friendId: number,
): Promise<FriendshipRow> {
	const result = await pool.query<FriendshipRow>(
		`DELETE FROM friendships
         WHERE (user_id = $1 AND friend_id = $2)
		 AND friendship_status = "pending"
         RETURNING *`,
		[cancellingId, friendId],
	);

	const friendships = result.rows[0];
	if (!friendships) translatePostgresError("cancelFriendship", undefined, { notFound: true });
	return friendships;
}

/**
 *
 * @param rejectingId USER WHO RECEIVED THE REQUEST
 * @param requestingId
 * @returns
 */
export async function rejectFriendship(
	rejectingId: number,
	requestingId: number,
): Promise<FriendshipRow> {
	const result = await pool.query<FriendshipRow>(
		`DELETE FROM friendships
         WHERE (user_id = $1 AND friend_id = $2)
		 AND friendship_status = "pending"
         RETURNING *`,
		[rejectingId, requestingId],
	);

	const friendships = result.rows[0];
	if (!friendships) translatePostgresError("rejectFriendship", undefined, { notFound: true });
	return friendships;
}

/**
 *
 * @param userId ONE WHO INITIATED REMOVAL
 * @param friendId
 * @returns
 */
export async function deleteFriendship(userId: number, friendId: number): Promise<FriendshipRow> {
	const result = await pool.query<FriendshipRow>(
		`DELETE FROM friendships
         WHERE (user_id = $1 AND friend_id = $2)
		 OR (user_id = $2 AND friend_id = $1)
		 AND friendship_status = "friends"
         RETURNING *`,
		[userId, friendId],
	);

	const friendships = result.rows[0];
	if (!friendships) translatePostgresError("deleteFriendship", undefined, { notFound: true });
	return friendships;
}
