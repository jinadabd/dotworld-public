// ====================== CREATE ============================

import { ServerError, ServerErrorCode } from "../errors/ServerError.ts";
import {
	changeTrinketCoverURL,
	changeTrinketDescription,
	changeTrinketMetadata,
	changeTrinketTitle,
	changeTrinketVisibility,
	createTrinket,
	deleteTrinketCoverURL,
	deleteTrinketDescription,
	deleteTrinketMetadata,
	featureTrinket,
	getTrinketById,
	unfeatureTrinket,
} from "../models/Trinkets.ts";
import type {
	CreateTrinketInput,
	EditTrinketInput,
	JSONValue,
	TrinketRow,
	TrinketType,
} from "../types/types.ts";
import { deleteFromR2Service } from "./CloudflareServices.ts";
import { requireFriendship } from "./FriendshipServices.ts";

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
		input.description,
		input.cover_url,
		input.metadata,
	);

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
					input.options.includes("delete_cover")
				)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editTrinketService");

				const { trinket: t1, oldCoverURL: changedCover } = await changeTrinketCoverURL(
					trinket.id,
					input.cover_url,
				);
				if (changedCover) await deleteFromR2Service(changedCover);
				break;

			case "delete_cover":
				if (
					!trinket.cover_url ||
					trinket.cover_url.trim().length === 0 ||
					input.cover_url ||
					input.options.includes("change_cover")
				)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editTrinketService");

				const { trinket: t2, oldCoverURL: deletedCover } = await deleteTrinketCoverURL(
					trinket.id,
				);
				if (deletedCover) await deleteFromR2Service(deletedCover);
				break;

			case "change_metadata":
				if (
					!input.metadata ||
					input.metadata === null ||
					input.metadata === trinket.metadata ||
					input.options.includes("delete_metadata")
				)
					throw new ServerError(ServerErrorCode.INVALID_INPUT, "editTrinketService");

				requireValidTrinketMetadata(input.metadata);
				const { trinket: t3, oldMetadata: changedMetadata } = await changeTrinketMetadata(
					trinket.id,
					input.metadata,
				);
				if (changedMetadata) await metadataCleanup(changedMetadata, input.metadata);
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

				if (deletedMetadata) await metadataCleanup(deletedMetadata);
		}
	}
}

// ====================== REQUIRES ============================

async function metadataCleanup(oldMetadata: JSONValue, newMetadata?: JSONValue) {}

function requireValidTrinketMetadata(metadata: JSONValue) {}

async function requireTrinketAuthorship(userId: number, trinketId: number): Promise<TrinketRow> {
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
	// requireTrinketVisibility(authorId);
}

function requireTrinketType(type: TrinketType) {
	const valid = type === "collection" || type === "gallery" || type === "playlist";
	if (!valid) throw new ServerError(ServerErrorCode.INVALID_INPUT, "requireTrinketType");
}

function requireTrinketTitle(title: string) {
	if (title.trim().length === 0)
		throw new ServerError(ServerErrorCode.MISSING_FIELD, "requireTrinketFields");
}
