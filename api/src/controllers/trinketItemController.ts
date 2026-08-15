import { type Request, type Response } from "express";
import type { CreateTrinketItemInput } from "../types/types.ts";
import {
	createTrinketItemService,
	deleteTrinketItemService,
	getAllTrinketItemsService,
	getTrinketItemService,
} from "../services/TrinketItemsServices.ts";

export async function createTrinketItem(
	req: Request<{ trinketId: string }, {}, CreateTrinketItemInput>,
	res: Response,
) {
	const authorId = (req as any).userId;
	const input = req.body as CreateTrinketItemInput;
	const trinketId = Number.parseInt(req.params.trinketId, 10);
	input.trinket_id = trinketId;
	const trinketItem = await createTrinketItemService(authorId, input);
	res.status(201).json(trinketItem);
}

export async function getTrinketItem(req: Request<{ trinketItemId: string }>, res: Response) {
	const userId = (req as any).userId;
	const trinketItemId = Number.parseInt(req.params.trinketItemId, 10);
	const trinketItem = await getTrinketItemService(userId, trinketItemId);
	res.status(200).json(trinketItem);
}

export async function getAllTrinketItems(req: Request<{ trinketId: string }>, res: Response) {
	const userId = (req as any).userId;
	const trinketId = Number.parseInt(req.params.trinketId, 10);
	const trinketItems = await getAllTrinketItemsService(userId, trinketId);
	res.status(200).json(trinketItems);
}

export async function deleteTrinketItem(
	req: Request<{ trinketId: string; trinketItemId: string }>,
	res: Response,
) {
	const userId = (req as any).userId;
	const trinketId = Number.parseInt(req.params.trinketId, 10);
	const trinketItemId = Number.parseInt(req.params.trinketItemId, 10);
	const trinketItem = await deleteTrinketItemService(userId, trinketId, trinketItemId);
	res.status(200).json(trinketItem);
}
