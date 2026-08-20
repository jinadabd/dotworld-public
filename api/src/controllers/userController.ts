import type { Request, Response } from "express";
import { getUserByIdService, searchUsersService } from "../services/UserServices.ts";

export async function getUser(req: Request<{ userId: string }>, res: Response) {
	const userId = Number.parseInt(req.params.userId, 10);
	const user = await getUserByIdService(userId);
	res.status(200).json(user);
}

export async function searchUsers(req: Request, res: Response) {
	const userId = (req as any).userId;
	const query = (req.query.q as string) ?? "";
	const searchResult = await searchUsersService(userId, query);
	res.status(200).json(searchResult);
}
