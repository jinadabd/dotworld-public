import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ServerError, ServerErrorCode } from "../errors/ServerError.ts";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;
	if (!authHeader?.startsWith("Bearer ")) {
		next(new ServerError(ServerErrorCode.MISSING_TOKEN, "requireAuth"));
	}

	const token = authHeader!.split(" ")[1];
	if (!token) {
		next(new ServerError(ServerErrorCode.MISSING_TOKEN, "requireAuth"));
	}
	try {
		const payload = jwt.verify(token!, process.env.JWT_SECRET!) as { userId: number };
		(req as any).userId = payload.userId;
		next();
	} catch {
		next(new ServerError(ServerErrorCode.INVALID_TOKEN, "requireAuth"));
	}
}
