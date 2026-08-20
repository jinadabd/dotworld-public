// ====================== CREATE ============================

import { ServerError, ServerErrorCode } from "../errors/ServerError.ts";
import { getAllUserFriends } from "../models/Friendships.ts";
import { deleteTrinketItem, getAllTrinketItems } from "../models/TrinketItems.ts";
import {
	changeTrinketCoverURL,
	changeTrinketDescription,
	changeTrinketMetadata,
	changeTrinketTitle,
	changeTrinketVisibility,
	createTrinket,
	deleteTrinket,
	deleteTrinketCoverURL,
	deleteTrinketDescription,
	deleteTrinketMetadata,
	featureTrinket,
	getAllFriendsTrinkets,
	getAllTrinketsByUserId,
	getPublicTrinkets,
	getTrinketById,
	unfeatureTrinket,
} from "../models/Trinkets.ts";
import { decrementUserStorage, getUserByUsername, incrementUserStorage } from "../models/User.ts";
import type {
	CreateTrinketInput,
	EditTrinketInput,
	PaginatedTrinkets,
	TrinketItemRow,
	TrinketRow,
	TrinketType,
	TrinketVisibility,
} from "../types/types.ts";
import { deleteFromR2Service } from "./CloudflareServices.ts";
import { requireFriendship } from "./FriendshipServices.ts";
import { deleteAllTrinketItemsService } from "./TrinketItemsServices.ts";

export async function createTrinketService(
	authorId: number,
	input: CreateTrinketInput,
): Promise<TrinketRow> {
	requireTrinketFields(authorId, input);

	const trinket = await createTrinket(
		authorId,
		input.trinket_visibility,
		input.trinket_type,
		input.title,
		input.file_size_bytes,
		input.description,
		input.cover_url,
		input.metadata,
	);

	if (trinket.cover_url) await incrementUserStorage(authorId, trinket.file_size_bytes);

	const createdTrinket = await getTrinketById(trinket.id);
	if (!createdTrinket)
		throw new ServerError(ServerErrorCode.DATABASE_FAILURE, "createTrinketService");

	return createdTrinket;
}

// ========================= GET ============================

export async function getTrinketService(userId: number, trinketId: number): Promise<TrinketRow> {
	const trinket = await getTrinketById(trinketId);

	if (trinket.user_id === userId) return trinket;
	if (trinket.trinket_visibility === "world") return trinket;

	if (trinket.trinket_visibility === "friends") {
		await requireFriendship(trinket.user_id, userId);
		return trinket;
	}

	throw new ServerError(ServerErrorCode.ACCESS_DENIED, "getTrinketService");
}

export async function getUserTrinketsService(
	viewerId: number,
	username: string,
): Promise<TrinketRow[]> {
	const user = await getUserByUsername(username);
	if (!user) throw new ServerError(ServerErrorCode.NOT_FOUND, "getUserTrinketsService");

	if (viewerId !== user.id) await requireFriendship(user.id, viewerId);

	const trinkets = await getAllTrinketsByUserId(user.id);
	if (viewerId === user.id) return trinkets;

	const trinketsToShow = trinkets.filter((trinket) => trinket.trinket_visibility !== "self");
	return trinketsToShow;
}

export async function getCommunityTrinketsService(): Promise<TrinketRow[]> {
	return await getPublicTrinkets();
}

export async function getFriendsTrinketsService(
	userId: number,
	page: number = 1,
	limit: number = 25,
): Promise<PaginatedTrinkets> {
	const friends = await getAllUserFriends(userId);
	const friendIds = friends.map((friendship) =>
		friendship.user_id === userId ? friendship.friend_id : friendship.user_id,
	);

	const { trinkets, count } = await getAllFriendsTrinkets(friendIds, page, limit);

	return {
		trinkets,
		pagination: {
			currentPage: page,
			totalPages: Math.ceil(count / limit),
			totalTrinkets: count,
			hasMore: page * limit < count,
		},
	};
}
// ========================= EDIT ============================

export async function editTrinketService(
	userId: number,
	input: EditTrinketInput,
): Promise<TrinketRow> {
	const trinket = await requireTrinketAuthorship(userId, input.trinket_id);
	if (input.options.length === 0)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "editTrinketService");

	for (const option of input.options) {
		switch (option) {
			case "change_visibility":
				if (!input.visibility || input.visibility === trinket.trinket_visibility)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editTrinketService");
				await changeTrinketVisibility(trinket.id, input.visibility);
				break;
			//sharetobubbles (future feature)

			case "feature":
				if (trinket.featured === true || input.options.includes("unfeature"))
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editTrinketService");
				await featureTrinket(trinket.id);
				break;

			case "unfeature":
				if (trinket.featured === false || input.options.includes("feature"))
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editTrinketService");
				await unfeatureTrinket(trinket.id);
				break;

			case "change_title":
				if (
					!input.title ||
					input.title === trinket.title ||
					input.title.trim().length === 0
				)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editTrinketService");
				await changeTrinketTitle(trinket.id, input.title);
				break;

			case "change_description":
				if (
					!input.description ||
					input.description === trinket.description ||
					input.description?.trim().length === 0 ||
					input.options.includes("delete_description")
				)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editTrinketService");
				await changeTrinketDescription(trinket.id, input.description);
				break;

			case "delete_description":
				if (
					!trinket.description ||
					trinket.description.trim().length === 0 ||
					input.description ||
					input.options.includes("change_description")
				)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editTrinketService");
				await deleteTrinketDescription(trinket.id);
				break;

			case "change_cover":
				if (
					!input.cover_url ||
					input.cover_url.trim().length === 0 ||
					input.file_size_bytes <= 0 ||
					input.options.includes("delete_cover")
				)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editTrinketService");
				const oldCoverSize = trinket.file_size_bytes;
				const { trinket: t1, oldCoverURL: changedCover } = await changeTrinketCoverURL(
					trinket.id,
					input.cover_url,
					input.file_size_bytes,
				);
				if (changedCover) await deleteFromR2Service(changedCover);
				if (oldCoverSize > input.file_size_bytes)
					await decrementUserStorage(userId, oldCoverSize - input.file_size_bytes);
				else if (input.file_size_bytes > oldCoverSize)
					await incrementUserStorage(userId, input.file_size_bytes - oldCoverSize);
				break;

			case "delete_cover":
				if (
					!trinket.cover_url ||
					trinket.cover_url.trim().length === 0 ||
					input.cover_url ||
					input.options.includes("change_cover")
				)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editTrinketService");
				const deletedCoverSize = trinket.file_size_bytes;
				const { trinket: t2, oldCoverURL: deletedCover } = await deleteTrinketCoverURL(
					trinket.id,
				);
				if (deletedCover) await deleteFromR2Service(deletedCover);
				await decrementUserStorage(userId, deletedCoverSize);
				break;

			case "change_metadata":
				if (
					!input.metadata ||
					input.metadata === null ||
					input.metadata === trinket.metadata ||
					input.options.includes("delete_metadata")
				)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editTrinketService");

				// requireValidTrinketMetadata(input.metadata);
				const { trinket: t3, oldMetadata: changedMetadata } = await changeTrinketMetadata(
					trinket.id,
					input.metadata,
				);
				// if (changedMetadata) await metadataCleanup(changedMetadata, input.metadata);
				break;

			case "delete_metadata":
				if (
					!trinket.metadata ||
					trinket.metadata === null ||
					input.metadata ||
					input.options.includes("change_metadata")
				)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editTrinketService");
				const { trinket: t4, oldMetadata: deletedMetadata } = await deleteTrinketMetadata(
					trinket.id,
				);

				// if (deletedMetadata) await metadataCleanup(deletedMetadata);
				break;

			default:
				throw new ServerError(ServerErrorCode.INVALID_INPUT, "editTrinketService");
		}
	}

	return await getTrinketById(trinket.id);
}

// ====================== DELETE ============================

export async function deleteTrinketService(
	userId: number,
	trinketId: number,
): Promise<{ trinket: TrinketRow; trinketItems: TrinketItemRow[] }> {
	const trinket = await requireTrinketAuthorship(userId, trinketId);
	if (trinket.cover_url) await deleteFromR2Service(trinket.cover_url);
	await decrementUserStorage(userId, trinket.file_size_bytes);
	// if (trinket.metadata !== null) await metadataCleanup(trinket.metadata);

	const trinketItems = await deleteAllTrinketItemsService(userId, trinketId);
	await deleteTrinket(trinketId);

	return { trinket, trinketItems };
}

// ====================== REQUIRES ============================

// async function metadataCleanup(oldMetadata: JSONValue, newMetadata?: JSONValue) {}

// function requireValidTrinketMetadata(metadata: JSONValue) {}

export async function requireTrinketAuthorship(
	userId: number,
	trinketId: number,
): Promise<TrinketRow> {
	const trinket = await getTrinketById(trinketId);
	if (userId !== trinket.user_id)
		throw new ServerError(ServerErrorCode.ACCESS_DENIED, "requireTrinketAuthorship");
	return trinket;
}

/**
 * @todo add await for future bubble implementation
 * @param authorId
 * @param input
 */
function requireTrinketFields(authorId: number, input: CreateTrinketInput) {
	requireTrinketType(input.trinket_type);
	requireTrinketTitle(input.title);
	requireTrinketVisibility(input.trinket_visibility);
}

function requireTrinketVisibility(visibility: TrinketVisibility) {
	const valid = visibility === "friends" || visibility === "self" || visibility === "world";
	if (!valid) throw new ServerError(ServerErrorCode.INVALID_INPUT, "requireTrinketVisibility");
}

function requireTrinketType(type: TrinketType) {
	const valid = type === "collection" || type === "gallery" || type === "playlist";
	if (!valid) throw new ServerError(ServerErrorCode.INVALID_INPUT, "requireTrinketType");
}

function requireTrinketTitle(title: string) {
	if (title.trim().length === 0)
		throw new ServerError(ServerErrorCode.MISSING_FIELD, "requireTrinketFields");
}
