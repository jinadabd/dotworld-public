import pool from "../config/postgres.ts";
import type { PostBubble } from "../types/types.ts";
import { translatePostgresError } from "../errors/PostgresError.ts";

// ==================== CREATE ====================

/**
 * Creates a row in the post_bubble table with postId and bubbleId
 * @param postId
 * @param bubbleId
 * @returns The created row.
 */

export async function createPostBubble(postId: number, bubbleId: number): Promise<PostBubble> {
	try {
		const result = await pool.query<PostBubble>(
			`INSERT INTO post_bubbles(post_id, bubble_id)
             VALUES ($1, $2) 
             RETURNING *`,
			[postId, bubbleId],
		);

		const post_bubble = result.rows[0];
		if (!post_bubble) translatePostgresError("createPostBubble");
		return post_bubble;
	} catch (err: any) {
		translatePostgresError("createPostBubble", err);
	}
}

/**
 * Creates multiple rows for each bubbleId with the same postId
 * @param postId
 * @param bubbleIds
 * @returns The created rows in an array.
 */

export async function sharePostToBubbles(
	postId: number,
	bubbleIds: number[],
): Promise<PostBubble[]> {
	try {
		const queryValues = bubbleIds.map((_, index) => `($1, $${index + 2})`).join(", ");
		const result = await pool.query<PostBubble>(
			`INSERT INTO post_bubbles(post_id, bubble_id)
         VALUES ${queryValues}
         RETURNING *`,
			[postId, ...bubbleIds],
		);

		const postBubbles = result.rows;
		if (!postBubbles) translatePostgresError("createPostBubble");
		return postBubbles;
	} catch (err: any) {
		translatePostgresError("createPostBubble", err);
	}
}

// ==================== READ ====================

/**
 * Gets all the bubbles that the post is shared to.
 * @param postId
 * @returns An array of PostBubble.
 */
export async function getAllBubblesByPostId(postId: number): Promise<PostBubble[]> {
	const result = await pool.query<PostBubble>(
		`SELECT *
         FROM post_bubbles
         WHERE post_id = $1`,
		[postId],
	);

	const bubblesForPost = result.rows;
	if (!bubblesForPost)
		translatePostgresError("getAllPostBubblesByPostId", undefined, { notFound: true });
	return bubblesForPost;
}

/**
 * Gets all the posts that are shared to this bubble
 * @param bubbleId
 * @returns An array of PostBubble
 */

export async function getAllPostsByBubbleId(bubbleId: number): Promise<PostBubble[]> {
	const result = await pool.query<PostBubble>(
		`SELECT *
         FROM post_bubbles
         WHERE bubble_id = $1`,
		[bubbleId],
	);

	const postsInBubble = result.rows;
	if (!postsInBubble)
		translatePostgresError("getAllPostBubblesByPostId", undefined, { notFound: true });
	return postsInBubble;
}

// ==================== DELETE ====================

/**
 * Delete a row in the post_bubble table with postId and bubbleId
 * @param postId
 * @param bubbleId
 * @returns The deleted row
 */

export async function deletePostBubble(postId: number, bubbleId: number): Promise<PostBubble> {
	const result = await pool.query(
		`DELETE FROM post_bubbles
		 WHERE post_id = $1 AND bubble_id = $2
         RETURNING *`,
		[postId, bubbleId],
	);

	if (result.rowCount !== 1)
		translatePostgresError("deletePostBubble", undefined, { notFound: true });

	const post_bubble = result.rows[0];
	if (!post_bubble) translatePostgresError("deletePostBubble", undefined, { notFound: true });

	return post_bubble;
}

/**
 * Deletes multiple rows for each bubbleId with the same postId
 * @param postId
 * @param bubbleIds (Optional) specifies which postBubbles to delete. Not passing it means ALL postBubbles are deleted
 * @returns The deleted rows in an array.
 */

export async function unsharePostFromBubbles(
	postId: number,
	bubbleIds?: number[],
): Promise<PostBubble[]> {
	if (bubbleIds) {
		const queryValues = bubbleIds.map((_, index) => `($${index + 2})`).join(", ");
		const result = await pool.query<PostBubble>(
			`DELETE FROM post_bubbles
		 	 WHERE post_id = $1 
			 AND (bubble_id IN ${queryValues})
    		 RETURNING *`,
			[postId, ...bubbleIds],
		);

		const postBubbles = result.rows;
		if (!postBubbles) translatePostgresError("unsharePostFromBubbles");
		return postBubbles;
	} else {
		const result = await pool.query<PostBubble>(
			`DELETE FROM post_bubbles
		 	 WHERE post_id = $1 
    		 RETURNING *`,
			[postId],
		);

		const postBubbles = result.rows;
		if (!postBubbles) translatePostgresError("unsharePostFromBubbles");
		return postBubbles;
	}
}
