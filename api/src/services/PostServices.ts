import { MAX_POST_BUBBLES } from "../constants/businessLogic.ts";
import { ServerError, ServerErrorCode } from "../errors/ServerError.ts";
import { getAllUserFriends } from "../models/Friendships.ts";
import {
	changePostBody,
	changePostVisibility,
	createPost,
	deletePost,
	deletePostBody,
	getPostById,
	getPostsFromFriends,
	getPostsFromUser,
} from "../models/Post.ts";
import {
	getAllBubblesByPostId,
	sharePostToBubbles,
	unsharePostFromBubbles,
} from "../models/PostBubble.ts";
import { decrementUserStorage, getUserById, incrementUserStorage } from "../models/User.ts";
import type {
	ComposePostInput,
	EditPostInput,
	EditPostOptions,
	PaginatedPosts,
	PostBubble,
	PostRow,
	PostType,
	PostVisibility,
	PostWithAuthor,
} from "../types/types.ts";
import { requireBubbleMembership } from "./BubbleServices.ts";
import { deleteFromR2Service } from "./CloudflareServices.ts";
import { requireFriendship } from "./FriendshipServices.ts";

// ====================== COMPOSE ============================

export async function composePostService(
	authorId: number,
	input: ComposePostInput,
): Promise<PostRow> {
	await requirePostFields(authorId, input);

	const post = await createPost(
		authorId,
		input.post_visibility,
		input.post_type,
		input.body_text,
		input.media_url,
		input.file_size_bytes,
	);

	if (input.post_visibility === "bubble") {
		await sharePostToBubbles(post.id, input.post_bubbles!);
	}

	if (input.file_size_bytes > 0) await incrementUserStorage(authorId, input.file_size_bytes);

	const createdPost = await getPostById(post.id);
	if (!createdPost) throw new ServerError(ServerErrorCode.DATABASE_FAILURE, "composePostService");

	return createdPost;
}

// =========================== GET ==========================

export async function getPostService(userId: number, postId: number): Promise<PostWithAuthor> {
	const post = await getPostById(postId);
	const author = await getUserById(post.user_id);
	if (post.user_id === userId) return { post, author };

	await requirePostAccess(userId, post);
	return { post, author };
}

export async function getUserPostsService(
	viewerId: number,
	userId: number,
	page: number = 1,
	limit: number = 25,
): Promise<PaginatedPosts> {
	if (viewerId !== userId) await requireFriendship(viewerId, userId);
	const { posts } = await getPostsFromUser(userId, page, limit);
	const filteredPosts = posts.filter((post) => post.post_visibility !== "self");

	const filteredWithAuthors: PostWithAuthor[] = await Promise.all(
		filteredPosts.map(async (post) => {
			const author = await getUserById(post.user_id);
			return { post, author };
		}),
	);
	const filteredCount = filteredWithAuthors.length;

	return {
		posts: filteredWithAuthors,
		pagination: {
			currentPage: page,
			totalPages: Math.ceil(filteredCount / limit),
			totalPosts: filteredCount,
			hasMore: page * limit < filteredCount,
		},
	};
}

export async function getFriendsChatterService(
	userId: number,
	page: number = 1,
	limit: number = 25,
): Promise<PaginatedPosts> {
	const friends = await getAllUserFriends(userId);
	const friendIds = friends.map((friend) => friend.id);
	const { posts } = await getPostsFromFriends(friendIds, page, limit);
	const filteredPosts = posts.filter((post) => post.post_visibility !== "self");

	const filteredWithAuthors: PostWithAuthor[] = await Promise.all(
		filteredPosts.map(async (post) => {
			const author = await getUserById(post.user_id);
			return { post, author };
		}),
	);
	const filteredCount = filteredWithAuthors.length;

	return {
		posts: filteredWithAuthors,
		pagination: {
			currentPage: page,
			totalPages: Math.ceil(filteredCount / limit),
			totalPosts: filteredCount,
			hasMore: page * limit < filteredCount,
		},
	};
}

// =========================== EDIT ==========================

export async function editPostService(
	authorId: number,
	input: EditPostInput,
): Promise<PostWithAuthor> {
	const { post: post } = await requirePostAuthorship(authorId, input.post_id);
	const options = requireEditPostOptions(input.edit_options);

	for (const option of options) {
		switch (option) {
			case "change_post_visibility":
				const { visibility, postBubbles } = await requirePostVisibility(
					authorId,
					input.post_visibility,
					input.post_bubbles,
				);
				await editPostVisibility(post, visibility, postBubbles);
				break;

			case "delete_body_text":
				await removePostBody(post);
				break;

			case "edit_body_text":
				const body = requirePostBody(input.body_text);
				await editPostBody(post, body);
				break;

			case "remove_post_bubbles":
				const postBubblesToRemove = requirePostBubbles(input.post_bubbles);
				await removePostFromBubbles(authorId, post, postBubblesToRemove);
				break;

			case "add_post_bubbles":
				const postBubblesToAdd = requirePostBubbles(input.post_bubbles);
				await addPostToBubbles(authorId, post, postBubblesToAdd);
				break;

			default:
				throw new ServerError(ServerErrorCode.INVALID_INPUT, "editPostService");
		}
	}
	const author = await getUserById(authorId);
	const updatedPost = await getPostById(post.id);

	return { post: updatedPost, author: author };
}

async function editPostVisibility(
	post: PostRow,
	postVisibility: PostVisibility,
	postBubbles?: number[],
): Promise<PostRow> {
	requireDifferentPostVisibility(post.post_visibility, postVisibility);

	if (post.post_visibility === "bubble") {
		await unsharePostFromBubbles(post.id);
	}

	const editedPost = await changePostVisibility(post.id, postVisibility);
	if (postVisibility === "bubble" && postBubbles && postBubbles.length > 0)
		await sharePostToBubbles(post.id, postBubbles);

	return editedPost;
}

async function editPostBody(post: PostRow, postBody: string): Promise<PostRow> {
	requireDifferentPostBody(post, postBody);

	return await changePostBody(post.id, postBody);
}

async function removePostBody(post: PostRow): Promise<PostRow> {
	return deletePostBody(post.id);
}

async function addPostToBubbles(
	authorId: number,
	post: PostRow,
	postBubbles: number[],
): Promise<PostBubble[]> {
	requirePostVisibilityIsBubble(post);
	await requireValidPostBubble(authorId, postBubbles);

	const postBubblesToAdd = await filterNewBubblesForPost(post.id, postBubbles);

	return await sharePostToBubbles(post.id, postBubblesToAdd);
}

async function removePostFromBubbles(
	authorId: number,
	post: PostRow,
	postBubbles: number[],
): Promise<PostBubble[]> {
	requirePostVisibilityIsBubble(post);
	await requireValidPostBubble(authorId, postBubbles);

	const postBubblesToRemove = await filterExistingBubblesForPost(post.id, postBubbles);

	return await unsharePostFromBubbles(post.id, postBubblesToRemove);
}

// =========================== DELETE ==========================

export async function deletePostService(authorId: number, postId: number): Promise<PostWithAuthor> {
	await requirePostAuthorship(authorId, postId);

	const post = await deletePost(postId, authorId);
	await unsharePostFromBubbles(postId);
	if (post.media_url) {
		await deleteFromR2Service(post.media_url);
		if (post.file_size_bytes > 0) await decrementUserStorage(authorId, post.file_size_bytes);
	}

	const author = await getUserById(authorId);
	return { post, author };
}

// ========================== REQUIRES ===========================

async function requirePostVisibility(
	authorId: number,
	visibility?: PostVisibility,
	bubbleIds?: number[],
): Promise<{ visibility: PostVisibility; postBubbles?: number[] }> {
	if (!visibility) throw new ServerError(ServerErrorCode.MISSING_FIELD, "requirePostVisibility");
	if (visibility === "bubble") {
		const postBubbles = await requireValidPostBubble(authorId, bubbleIds);
		return { visibility, postBubbles };
	}
	return { visibility };
}

function requirePostVisibilityIsBubble(post: PostRow) {
	if (post.post_visibility !== "bubble")
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "requirePostVisibilityIsBubble");
}

async function requireDifferentPostVisibility(
	currentPostVisibility: PostVisibility,
	newPostVisibility: PostVisibility,
) {
	if (currentPostVisibility === newPostVisibility)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "requireDifferentPostVisibility");
}

function requirePostType(type: PostType): PostType {
	if (!type) throw new ServerError(ServerErrorCode.MISSING_FIELD, "requirePostType");
	return type;
}

function requirePostBody(body?: string): string {
	if (!body || body.trim().length === 0)
		throw new ServerError(ServerErrorCode.MISSING_FIELD, "requirePostBody");
	return body;
}

function requirePostMedia(media?: string): string {
	if (!media || media.trim().length === 0)
		throw new ServerError(ServerErrorCode.MISSING_FIELD, "requirePostMedia");
	return media;
}

function requirePostMediaSize(bytes: number) {
	if (bytes <= 0) throw new ServerError(ServerErrorCode.MISSING_FIELD, "requirePostMediaSize");
}

function requirePostNoMedia(bytes: number, media?: string) {
	if (bytes > 0) throw new ServerError(ServerErrorCode.INVALID_INPUT, "requirePostNoMedia");
	if (media && media.trim().length > 0)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "requirePostNoMedia");
}

async function requirePostFields(
	authorId: number,
	input: ComposePostInput,
): Promise<ComposePostInput> {
	requirePostType(input.post_type);

	if (input.post_type === "text") {
		requirePostBody(input.body_text ?? "");
		requirePostNoMedia(input.file_size_bytes, input.media_url);
	} else {
		requirePostMedia(input.media_url ?? "");
		requirePostMediaSize(input.file_size_bytes);
	}

	await requirePostVisibility(authorId, input.post_visibility, input.post_bubbles);
	return input;
}

function requirePostBubbles(bubbleIds?: number[]): number[] {
	if (!bubbleIds || (bubbleIds && bubbleIds.length === 0))
		throw new ServerError(ServerErrorCode.MISSING_FIELD, "requirePostBubbles");
	if (bubbleIds.length > MAX_POST_BUBBLES)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "requirePostBubbles");
	return bubbleIds;
}

async function requireValidPostBubble(authorId: number, bubbleIds?: number[]) {
	const postBubbles = requirePostBubbles(bubbleIds);
	await requireBubbleMembership(authorId, postBubbles);
	return postBubbles;
}

async function filterNewBubblesForPost(
	postId: number,
	inputBubbleIds: number[],
): Promise<number[]> {
	const currentBubbles = await getAllBubblesByPostId(postId);
	const existingBubbles = new Set(currentBubbles.map((postBubble) => postBubble.bubble_id));
	const newBubbles = inputBubbleIds.filter((bubbleId) => !existingBubbles.has(bubbleId));

	if (newBubbles.length === 0)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "filterNewBubblesForPost");

	return newBubbles;
}

async function filterExistingBubblesForPost(
	postId: number,
	inputBubbleIds: number[],
): Promise<number[]> {
	const currentBubbles = await getAllBubblesByPostId(postId);
	const existingBubbles = new Set(currentBubbles.map((postBubble) => postBubble.bubble_id));
	const targetBubbles = inputBubbleIds.filter((bubbleId) => existingBubbles.has(bubbleId));

	if (targetBubbles.length === 0)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "filterExistingBubblesForPost");

	return targetBubbles;
}

async function requirePostAuthorship(
	authorId?: number,
	postId?: number,
): Promise<{ authorId: number; post: PostRow }> {
	if (!authorId || !postId)
		throw new ServerError(ServerErrorCode.MISSING_FIELD, "requirePostAuthorship");
	const post = await getPostById(postId);
	if (!post) throw new ServerError(ServerErrorCode.NOT_FOUND, "requirePostAuthorship");
	if (post && post.user_id !== authorId)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "requirePostAuthorship");

	return { authorId, post };
}

function requireDifferentPostBody(post: PostRow, postBody: string) {
	if (post?.body_text === postBody)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "requireDifferentPostBody");
}

function requireEditPostOptions(options: EditPostOptions[]): EditPostOptions[] {
	if (!options || options.length === 0)
		throw new ServerError(ServerErrorCode.MISSING_FIELD, "requireEditPostOptions");
	return options;
}

async function requirePostAccess(userId: number, post: PostRow) {
	switch (post.post_visibility) {
		case "self":
			if (post.user_id !== userId)
				throw new ServerError(ServerErrorCode.ACCESS_DENIED, "requirePostAccess");
			break;
		case "bubble":
			const postBubbles = await getAllBubblesByPostId(post.id);
			const bubbleIds = postBubbles.map((postBubble) => postBubble.bubble_id);
			await requireBubbleMembership(userId, bubbleIds);
			break;
		case "friends":
			await requireFriendship(userId, post.user_id);
			break;
		default:
			throw new ServerError(ServerErrorCode.ACCESS_DENIED, "requirePostAccess");
	}
}
