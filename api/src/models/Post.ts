import pool from "../config/postgres.ts";
import type { PostRow, PostVisibility, PostType } from "../types/types.ts";
import { translatePostgresError } from "../errors/PostgresError.ts";

// ==================== CREATE ====================

/**
 * Creates a new row in the database
 * @param userId
 * @param postVisibility
 * @param postType
 * @param bodyText
 * @param mediaURL
 * @param mediaSizeBytes
 * @returns The post row if successfull
 * @throws DATABASE_FAILURE if unsuccessful
 */

export async function createPost(
	userId: number,
	postVisibility: PostVisibility,
	postType: PostType,
	bodyText?: string,
	mediaURL?: string,
	mediaSizeBytes?: number,
): Promise<PostRow> {
	if (!bodyText) bodyText = "";
	if (!mediaURL) {
		mediaURL = "";
		mediaSizeBytes = 0;
	}
	try {
		const result = await pool.query<PostRow>(
			`INSERT INTO posts(user_id, post_visibility, post_type, body_text, media_url, file_size_bytes)
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
			[userId, postVisibility, postType, bodyText, mediaURL, mediaSizeBytes],
		);

		const post = result.rows[0];
		if (!post) translatePostgresError("createPost");
		return post;
	} catch (err: any) {
		translatePostgresError("createUser", err);
	}
}

// ==================== READ ====================

/**
 * Fetches a post using its postId
 * @param postId - The post's ID
 * @returns The relevant post row,; null if not found.
 */

export async function getPostById(postId: number): Promise<PostRow> {
	const result = await pool.query<PostRow>(
		`SELECT *
         FROM posts
         WHERE id = $1`,
		[postId],
	);

	const post = result.rows[0];
	if (!post) translatePostgresError("getPostById", undefined, { notFound: true });
	return post;
}

/**
 * Fetches up to {limit} most recent posts before {timestamp}.
 * @param userId - ID of the user the posts belong to.
 * @param limit - Maximum number of posts to fetch.
 * @param timestamp - Only posts made before this will be fetched.
 * @returns An array of up to {limit} posts from the given user, created before {timestamp}, sorted by most recent; null if not found.
 */

export async function getPostsFromUser(
	userId: number,
	limit: number,
	timestamp: Date,
): Promise<PostRow[] | null> {
	if (!timestamp) timestamp = new Date();
	const result = await pool.query<PostRow>(
		`SELECT *
         FROM posts
         WHERE user_id = $1 AND created_at <= $2
         ORDER BY created_at DESC
         LIMIT $3`,
		[userId, timestamp, limit],
	);

	const posts = result.rows ?? null;
	return posts;
}

// ==================== UPDATE ====================

/**
 * Changes the post_visibility column. (Not responsible for PostBubble settings, if applicable)
 * @param postId
 * @param newVisibility
 * @returns The post row after changing visibility.
 */
export async function changePostVisibility(
	postId: number,
	newVisibility: PostVisibility,
): Promise<PostRow> {
	const result = await pool.query<PostRow>(
		`UPDATE posts
         SET post_visibility = $1
         WHERE id = $2
         RETURNING *`,
		[newVisibility, postId],
	);

	const post = result.rows[0];
	if (!post) translatePostgresError("changePostVisibility", undefined, { notFound: true });
	return post;
}

/**
 * Sets the featured column to {isFeatured}.
 * @param postId
 * @param isFeatured
 * @returns The post row after changing featured.
 */

export async function changePostFeatured(postId: number, isFeatured: boolean): Promise<PostRow> {
	const result = await pool.query<PostRow>(
		`UPDATE posts
         SET featured = $1
         WHERE id = $2
         RETURNING *`,
		[isFeatured, postId],
	);

	const post = result.rows[0];
	if (!post) translatePostgresError("changePostFeatured", undefined, { notFound: true });
	return post;
}

/**
 * Sets the body_text column to {newBodyText} and toggles on the edited property
 * @param postId
 * @param newBodyText
 * @returns The post row after changing body_text, with edited set to true
 */

export async function changePostBody(postId: number, newBodyText: string): Promise<PostRow> {
	const result = await pool.query<PostRow>(
		`UPDATE posts
         SET body_text = $1, edited = true
         WHERE id = $2
         RETURNING *`,
		[newBodyText, postId],
	);

	const post = result.rows[0];
	if (!post) translatePostgresError("changePostBody", undefined, { notFound: true });
	return post;
}

// ==================== DELETE ====================

/**
 * Deletes the body_text property, and toggles on the edited property
 * @param postId
 * @returns The post row after deleting body_text, with edited set to true
 */

export async function deletePostBody(postId: number): Promise<PostRow> {
	const post = await changePostBody(postId, "");
	return post;
}

/**
 * Deletes the post row from the database. (NOT RESPONSIBLE FOR DELETING STORED POST MEDIA)
 * @param postId
 * @returns The deleted post row.
 */

export async function deletePost(postId: number, authorId: number): Promise<PostRow> {
	const result = await pool.query(
		`DELETE FROM posts
		 WHERE id = $1
		 AND user_id = $2
		 RETURNING *`,
		[postId, authorId],
	);

	// if (result.rowCount !== 1) translatePostgresError("deleteUser", undefined, { notFound: true });

	const post = result.rows[0];
	if (!post) translatePostgresError("deletePost", undefined, { notFound: true });
	return post;
}
