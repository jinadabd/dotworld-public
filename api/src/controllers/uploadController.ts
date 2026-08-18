import type { NextFunction, Request, Response } from "express";
import { signUploadService } from "../services/CloudflareServices.ts";

export async function signUpload(req: Request, res: Response, next: NextFunction) {
	try {
		const userId = (req as any).userId;
		const { category, contentType, fileSizeBytes } = req.body;
		const result = await signUploadService(userId, category, contentType, fileSizeBytes);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
}
