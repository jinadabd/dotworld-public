import { type Request, type Response } from "express";
import { loginService, meService, singupService } from "../services/UserServices.ts";
import type { LoginInput, SignupInput } from "../types/types.ts";

export async function signup(req: Request, res: Response) {
	const session = await singupService(req.body as SignupInput);
	res.status(201).json(session);
}

export async function login(req: Request, res: Response) {
	const session = await loginService(req.body as LoginInput);
	res.status(200).json(session);
}

export async function me(req: Request, res: Response) {
	const userId = (req as any).userId;
	const user = await meService(userId);
	res.json(user);
}
