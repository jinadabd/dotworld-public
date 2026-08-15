import { ServerError, ServerErrorCode } from "../errors/ServerError.ts";
import {
	createTrinketItem,
	deleteAllTrinketItems,
	deleteTrinketItem,
	getAllTrinketItems,
	getTrinketItemById,
} from "../models/TrinketItems.ts";
import { getTrinketById } from "../models/Trinkets.ts";
import { decrementUserStorage, incrementUserStorage } from "../models/User.ts";

import type {
	CreateTrinketItemInput,
	PostType,
	TrinketItemRow,
	TrinketType,
} from "../types/types.ts";
import { deleteFromR2Service } from "./CloudflareServices.ts";
import { requireFriendship } from "./FriendshipServices.ts";
import { requireTrinketAuthorship } from "./TrinketServices.ts";

// ================ CREATE ====================

export async function createTrinketItemService(
	userId: number,
	input: CreateTrinketItemInput,
): Promise<TrinketItemRow> {
	const trinket = await requireTrinketAuthorship(userId, input.trinket_id);
	requireValidTrinketItemType(
		trinket.trinket_type,
		input.item_type,
		input.file_size_bytes,
		input.media_url,
	);
	if (input.item_order < 0)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "createTrinketItemService");

	const trinketItem = createTrinketItem(
		trinket.id,
		input.item_type,
		input.item_order,
		input.file_size_bytes,
		input.title,
		input.description,
		input.media_url,
		input.metadata,
	);

	if (input.media_url) await incrementUserStorage(userId, input.file_size_bytes);

	return trinketItem;
}

// ================ GET ====================

export async function getTrinketItemService(
	userId: number,
	trinketItemId: number,
): Promise<TrinketItemRow> {
	const trinketItem = await getTrinketItemById(trinketItemId);
	const trinket = await getTrinketById(trinketItem.trinket_id);

	if (trinket.user_id === userId) return trinketItem;
	if (trinket.trinket_visibility === "world") return trinketItem;

	if (trinket.trinket_visibility === "friends") {
		await requireFriendship(trinket.user_id, userId);
		return trinketItem;
	}

	throw new ServerError(ServerErrorCode.ACCESS_DENIED, "getTrinketService");
}

export async function getAllTrinketItemsService(
	userId: number,
	trinketId: number,
): Promise<TrinketItemRow[]> {
	const trinket = await getTrinketById(trinketId);
	const trinketItems = await getAllTrinketItems(trinketId);

	if (trinket.user_id === userId) return trinketItems;
	if (trinket.trinket_visibility === "world") return trinketItems;

	if (trinket.trinket_visibility === "friends") {
		await requireFriendship(trinket.user_id, userId);
		return trinketItems;
	}

	throw new ServerError(ServerErrorCode.ACCESS_DENIED, "getTrinketService");
}

// ================ DELETE ====================

export async function deleteTrinketItemService(
	userId: number,
	trinketId: number,
	trinketItemId: number,
): Promise<TrinketItemRow> {
	const trinket = await requireTrinketAuthorship(userId, trinketId);
	const trinketItem = await deleteTrinketItem(trinketItemId);
	if (trinketItem.media_url) {
		await deleteFromR2Service(trinketItem.media_url);
		await decrementUserStorage(userId, trinketItem.file_size_bytes);
	}

	return trinketItem;
}

export async function deleteAllTrinketItemsService(
	userId: number,
	trinketId: number,
): Promise<TrinketItemRow[]> {
	const trinket = await requireTrinketAuthorship(userId, trinketId);
	const trinketItems = await deleteAllTrinketItems(trinket.id);

	for (const trinketItem of trinketItems) {
		if (trinketItem.media_url) {
			await deleteFromR2Service(trinketItem.media_url);
			await decrementUserStorage(userId, trinketItem.file_size_bytes);
		}
	}

	return trinketItems;
}

// ================ REQUIRES ====================

function requireValidTrinketItemType(
	trinketType: TrinketType,
	itemType: PostType,
	fileSizeBytes: number,
	mediaURL?: string,
) {
	switch (trinketType) {
		case "playlist":
			if (itemType !== "audio")
				throw new ServerError(ServerErrorCode.INVALID_INPUT, "requireValidTrinketItemType");
			break;
		case "gallery":
			if (itemType !== "image" && itemType !== "video")
				throw new ServerError(ServerErrorCode.INVALID_INPUT, "requireValidTrinketItemType");
			break;

		case "collection":
			if (itemType !== "image" && itemType !== "text" && itemType !== "audio")
				throw new ServerError(ServerErrorCode.INVALID_INPUT, "requireValidTrinketItemType");
			break;

		default:
			throw new ServerError(ServerErrorCode.INVALID_INPUT, "requireValidTrinketItemType");
	}

	if (itemType !== "text" && (!mediaURL || mediaURL.trim().length === 0) && fileSizeBytes <= 0) {
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "requireValidTrinketItemType");
	}
}
