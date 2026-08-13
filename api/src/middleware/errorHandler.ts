import type { NextFunction, Request, Response } from "express";
import { ServerError, ServerErrorCode, ServerErrorStatus } from "../errors/ServerError.ts";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
	if (err instanceof ServerError) {
		const status = ServerErrorStatus[err.code];
		return res.status(status).json({ error: err.message, code: err.code });
	}

	console.error(err);
	res.status(500).json({ error: "Internal server error.", code: ServerErrorCode.INTERNAL_ERROR });
}
