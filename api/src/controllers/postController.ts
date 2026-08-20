import { type Request, type Response } from "express";
import {
	composePostService,
	deletePostService,
	editPostService,
	getFriendsChatterService,
	getPostService,
	getUserPostsService,
} from "../services/PostServices.ts";
import type { ComposePostInput, EditPostInput } from "../types/types.ts";

export async function composePost(req: Request<{}, {}, ComposePostInput>, res: Response) {
	const authorId = (req as any).userId;
	const input = req.body as ComposePostInput;
	const post = await composePostService(authorId, input);
	res.status(201).json(post);
}

export async function getPost(req: Request<{ postId: string }>, res: Response) {
	const userId = (req as any).userId;
	const postId = Number.parseInt(req.params.postId, 10);
	const post = await getPostService(userId, postId);
	res.status(200).json(post);
}

export async function getUserPosts(req: Request<{ username: string }>, res: Response) {
	const viewerId = (req as any).userId;
	const username = req.params.username;
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 25;
	const posts = await getUserPostsService(viewerId, username, page, limit);
	res.status(200).json(posts);
}

export async function getChatter(req: Request<{ page?: number; limit?: number }>, res: Response) {
	const userId = (req as any).userId;
	const page = req.query.page ? Number(req.query.page) : 1;
	const limit = req.query.limit ? Number(req.query.limit) : 25;
	const chatter = await getFriendsChatterService(userId, page, limit);
	res.status(200).json(chatter);
}

export async function editPost(req: Request<{ postId: string }, {}, EditPostInput>, res: Response) {
	const authorId = (req as any).userId;
	const postId = Number.parseInt(req.params.postId, 10);
	const input = req.body as EditPostInput;
	input.post_id = postId;
	const post = await editPostService(authorId, input);
	res.status(200).json(post);
}

export async function deletePost(req: Request<{ postId: string }>, res: Response) {
	const authorId = (req as any).userId;
	const postId = Number.parseInt(req.params.postId, 10);
	const post = await deletePostService(authorId, postId);
	res.status(200).json(post);
}
