import type { Request, Response } from "express";
import { getUserByIdService } from "../services/UserServices.ts";

export async function getUser(req: Request<{ userId: string }>, res: Response) {
	const userId = Number.parseInt(req.params.userId, 10);
	const user = await getUserByIdService(userId);
	res.status(200).json(user);
}
