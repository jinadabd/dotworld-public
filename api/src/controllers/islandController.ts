import type { Request, Response } from "express";
import type { CreateIslandInput, EditIslandInput } from "../types/types.ts";
import {
	createIslandService,
	deleteIslandService,
	editIslandService,
	getIslandService,
} from "../services/IslandServices.ts";

export async function setUpIsland(req: Request<{}, {}, CreateIslandInput>, res: Response) {
	const userId = (req as any).userId;
	const input = req.body as CreateIslandInput;
	const island = await createIslandService(userId, input);
	res.status(201).json(island);
}

export async function viewIsland(req: Request<{ username: string }>, res: Response) {
	const userId = (req as any).userId;
	const username = req.params.username;
	const island = await getIslandService(userId, username);
	res.status(200).json(island);
}

export async function editIsland(
	req: Request<{ username: string }, {}, EditIslandInput>,
	res: Response,
) {
	const userId = (req as any).userId;
	const username = req.params.username;
	const input = req.body as EditIslandInput;
	const island = await editIslandService(userId, username, input);
	res.status(200).json(island);
}

export async function deleteIsland(req: Request<{ username: string }>, res: Response) {
	const userId = (req as any).userId;
	const username = req.params.username;
	const island = await deleteIslandService(userId, username);
	res.status(200).json(island);
}
