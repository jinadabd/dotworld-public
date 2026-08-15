import { type Request, type Response } from "express";
import type { CreateTrinketInput, EditTrinketInput } from "../types/types.ts";
import {
	createTrinketService,
	deleteTrinketService,
	editTrinketService,
	getTrinketService,
} from "../services/TrinketServices.ts";
import { getAllTrinketItemsService } from "../services/TrinketItemsServices.ts";

export async function createTrinket(req: Request<{}, {}, CreateTrinketInput>, res: Response) {
	const authorId = (req as any).userId;
	const input = req.body as CreateTrinketInput;
	const trinket = await createTrinketService(authorId, input);
	res.status(201).json(trinket);
}

export async function getTrinket(req: Request<{ trinketId: string }>, res: Response) {
	const userId = (req as any).userId;
	const trinketId = Number.parseInt(req.params.trinketId, 10);
	const trinket = await getTrinketService(userId, trinketId);
	const trinketItems = await getAllTrinketItemsService(userId, trinketId);
	res.status(200).json({ trinket: trinket, trinketItems: trinketItems });
}

export async function editTrinket(
	req: Request<{ trinketId: string }, {}, EditTrinketInput>,
	res: Response,
) {
	const userId = (req as any).userId;
	const trinketId = Number.parseInt(req.params.trinketId, 10);
	const input = req.body as EditTrinketInput;
	input.trinket_id = trinketId;
	const trinket = await editTrinketService(userId, input);
	res.status(200).json(trinket);
}

export async function deleteTrinket(req: Request<{ trinketId: string }>, res: Response) {
	const userId = (req as any).userId;
	const trinketId = Number.parseInt(req.params.trinketId, 10);
	const trinket = await deleteTrinketService(userId, trinketId);
	res.status(200).json(trinket);
}
