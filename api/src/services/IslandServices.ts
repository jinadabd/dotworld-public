import { ServerError, ServerErrorCode } from "../errors/ServerError.ts";
import {
	changeIslandCoverURL,
	changeIslandDescription,
	changeIslandMetadata,
	changeIslandName,
	changeIslandVisibility,
	createIsland,
	deleteIsland,
	deleteIslandCoverURL,
	deleteIslandDescription,
	deleteIslandMetadata,
	deleteIslandName,
	getIslandByIslandId,
	getIslandByUserId,
} from "../models/Islands.ts";
import { getAllFeaturedTrinkets } from "../models/Trinkets.ts";
import { getUserByUsername } from "../models/User.ts";
import {
	EditIslandOptions,
	type CreateIslandInput,
	type EditIslandInput,
	type IslandRow,
	type IslandVisibility,
	type JSONValue,
	type TrinketRow,
} from "../types/types.ts";
import { deleteFromR2Service } from "./CloudflareServices.ts";
import { requireFriendship } from "./FriendshipServices.ts";

// ==================== CREATE =====================

export async function createIslandService(
	userId: number,
	input: CreateIslandInput,
): Promise<IslandRow> {
	requireIslandInputFields(input);

	const existing = await getIslandByUserId(userId);
	if (existing) throw new ServerError(ServerErrorCode.INVALID_INPUT, "createIslandService");

	const island = await createIsland(
		userId,
		input.island_visibility,
		input.name,
		input.description,
		input.cover_url,
		input.metadata,
	);

	return island;
}

// ==================== READ =====================

export async function getIslandService(
	requestingId: number,
	islandUsername: string,
): Promise<{ island: IslandRow; featuredTrinkets: TrinketRow[] }> {
	const user = await getUserByUsername(islandUsername);
	if (!user) throw new ServerError(ServerErrorCode.INVALID_INPUT, "getIslandService");

	const island = await getIslandByUserId(user.id);
	if (!island) throw new ServerError(ServerErrorCode.NOT_FOUND, "getIslandService");

	if (island.island_visibility === "friends") requireFriendship(user.id, requestingId);

	const featuredTrinkets = await getAllFeaturedTrinkets(user.id);

	return { island, featuredTrinkets };
}

// ==================== DELETE =====================

export async function deleteIslandService(
	userId: number,
	islandUsername: string,
): Promise<IslandRow> {
	const user = await getUserByUsername(islandUsername);
	if (!user) throw new ServerError(ServerErrorCode.INVALID_INPUT, "deleteIslandService");

	const island = await getIslandByUserId(user.id);
	if (!island) throw new ServerError(ServerErrorCode.NOT_FOUND, "deleteIslandService");

	await requireIslandOwnership(userId, island.id);

	const deleted = await deleteIsland(island.id);
	if (deleted.cover_url) deleteFromR2Service(deleted.cover_url);
	return deleted;
}

// ==================== UPDATE =====================

export async function editIslandService(
	userId: number,
	islandUsername: string,
	input: EditIslandInput,
): Promise<IslandRow> {
	const user = await getUserByUsername(islandUsername);
	if (!user) throw new ServerError(ServerErrorCode.INVALID_INPUT, "deleteIslandService");

	const island = await getIslandByUserId(user.id);
	if (!island) throw new ServerError(ServerErrorCode.NOT_FOUND, "deleteIslandService");

	await requireIslandOwnership(userId, island.id);

	for (const option of input.options) {
		switch (option) {
			case EditIslandOptions.change_island_visibility:
				if (!input.island_visibility)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editIslandService");
				await changeVisibility(island, input.island_visibility);
				// await changeFeaturedTrinketVisibility(island, input.island_visibility);
				break;

			case EditIslandOptions.edit_name:
				if (!input.name)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editIslandService");
				await changeOrDeleteName(island, option, input.name);
				break;

			case EditIslandOptions.delete_name:
				if (input.name)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editIslandService");
				await changeOrDeleteName(island, option);
				break;

			case EditIslandOptions.edit_description:
				if (!input.description)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editIslandService");
				await changeOrDeleteDescription(island, option, input.description);
				break;

			case EditIslandOptions.delete_description:
				if (input.description)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editIslandService");
				await changeOrDeleteDescription(island, option);
				break;

			case EditIslandOptions.edit_cover_url:
				if (!input.cover_url)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editIslandService");
				await changeOrDeleteCoverURL(island, option, input.cover_url);
				break;

			case EditIslandOptions.delete_cover_url:
				if (input.cover_url)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editIslandService");
				await changeOrDeleteCoverURL(island, option);
				break;

			case EditIslandOptions.edit_metadata:
				if (!input.metadata)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editIslandService");
				await changeOrDeleteMetadata(island, option, input.metadata);
				break;

			case EditIslandOptions.delete_metadata:
				if (input.metadata)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editIslandService");
				await changeOrDeleteMetadata(island, option);
				break;

			default:
				throw new ServerError(ServerErrorCode.INVALID_INPUT, "editIslandService");
		}
	}

	const updatedIsland = await getIslandByIslandId(island.id);
	if (!updatedIsland) throw new ServerError(ServerErrorCode.INVALID_INPUT, "editIslandService");
	return updatedIsland;
}

async function changeOrDeleteMetadata(
	island: IslandRow,
	option: EditIslandOptions,
	newMetadata?: JSONValue,
) {
	if (option === EditIslandOptions.edit_metadata) {
		if (!newMetadata || island.metadata === newMetadata)
			throw new ServerError(ServerErrorCode.INVALID_INPUT, "changeOrDeleteMetadata");
		return await changeIslandMetadata(island.id, newMetadata);
	}
	if (option === EditIslandOptions.delete_metadata) {
		if (newMetadata || !island.metadata || island.metadata === null)
			throw new ServerError(ServerErrorCode.INVALID_INPUT, "changeOrDeleteMetadata");
		return await deleteIslandMetadata(island.id);
	}
	throw new ServerError(ServerErrorCode.INVALID_INPUT, "changeOrDeleteMetadata");
}

async function changeOrDeleteCoverURL(
	island: IslandRow,
	option: EditIslandOptions,
	newCoverURL?: string,
) {
	if (option === EditIslandOptions.edit_cover_url) {
		if (!newCoverURL || island.cover_url === newCoverURL)
			throw new ServerError(ServerErrorCode.INVALID_INPUT, "changeOrDeleteCoverURL");
		const changedCoverURL = (await changeIslandCoverURL(island.id, newCoverURL)).oldCoverURL;
		if (changedCoverURL) await deleteFromR2Service(changedCoverURL);
		return;
	}
	if (option === EditIslandOptions.delete_cover_url) {
		if (newCoverURL || !island.cover_url || island.cover_url.trim().length === 0)
			throw new ServerError(ServerErrorCode.INVALID_INPUT, "changeOrDeleteCoverURL");
		const deletedCoverURL = (await deleteIslandCoverURL(island.id)).oldCoverURL;
		if (deletedCoverURL) await deleteFromR2Service(deletedCoverURL);
		return;
	}
	throw new ServerError(ServerErrorCode.INVALID_INPUT, "changeOrDeleteCoverURL");
}

async function changeOrDeleteDescription(
	island: IslandRow,
	option: EditIslandOptions,
	newDescription?: string,
) {
	if (option === EditIslandOptions.edit_description) {
		if (!newDescription || island.description === newDescription)
			throw new ServerError(ServerErrorCode.INVALID_INPUT, "changeOrDeleteDescription");
		return await changeIslandDescription(island.id, newDescription);
	}
	if (option === EditIslandOptions.delete_description) {
		if (newDescription || !island.description || island.description.trim().length === 0)
			throw new ServerError(ServerErrorCode.INVALID_INPUT, "changeOrDeleteDescription");
		return await deleteIslandDescription(island.id);
	}
	throw new ServerError(ServerErrorCode.INVALID_INPUT, "changeOrDeleteDescription");
}

async function changeOrDeleteName(island: IslandRow, option: EditIslandOptions, newName?: string) {
	if (option === EditIslandOptions.edit_name) {
		if (!newName || island.name === newName)
			throw new ServerError(ServerErrorCode.INVALID_INPUT, "changeOrDeleteName");
		return await changeIslandName(island.id, newName);
	}
	if (option === EditIslandOptions.delete_name) {
		if (newName || !island.name || island.name.trim().length === 0)
			throw new ServerError(ServerErrorCode.INVALID_INPUT, "changeOrDeleteName");
		return await deleteIslandName(island.id);
	}
	throw new ServerError(ServerErrorCode.INVALID_INPUT, "changeOrDeleteName");
}

async function changeVisibility(island: IslandRow, newVisibility: IslandVisibility) {
	if (island.island_visibility === newVisibility)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "changeVisibility");
	if (newVisibility !== "friends" && newVisibility !== "world")
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "changeVisibility");
	await changeIslandVisibility(island.id, newVisibility);
}

// ==================== REQUIRES =====================

function requireIslandInputFields(input: CreateIslandInput) {
	if (
		!input.island_visibility ||
		(input.island_visibility !== "friends" && input.island_visibility !== "world")
	)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "requireIslandInputFields");
}

async function requireIslandOwnership(userId: number, islandId: number): Promise<IslandRow> {
	const island = await getIslandByUserId(userId);
	if (!island) throw new ServerError(ServerErrorCode.INVALID_INPUT, "requireIslandOwnership");
	if (userId !== island?.user_id)
		throw new ServerError(ServerErrorCode.ACCESS_DENIED, "requireIslandOwnership");
	return island;
}
