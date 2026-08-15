import pool from "../config/postgres.ts";
import { translatePostgresError } from "../errors/PostgresError.ts";
import type { JSONValue, PostType, TrinketItemReorder, TrinketItemRow } from "../types/types.ts";

// ==================== CREATE ====================

export async function createTrinketItem(
	trinketId: number,
	itemType: PostType,
	itemOrder: number,
	fileSizeBytes: number,
	title?: string,
	description?: string,
	mediaURL?: string,
	metadata?: JSONValue,
): Promise<TrinketItemRow> {
	try {
		const result = await pool.query<TrinketItemRow>(
			`INSERT INTO trinket_items(trinket_id, item_type, item_order, file_size_bytes, title, description, media_url, metadata)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
			[trinketId, itemType, itemOrder, fileSizeBytes, title, description, mediaURL, metadata],
		);

		const trinketItem = result.rows[0];
		if (!trinketItem) translatePostgresError("createTrinketItem");
		return trinketItem;
	} catch (err: any) {
		translatePostgresError("createTrinketItem", err);
	}
}

// ==================== READ ====================

export async function getTrinketItemById(trinketItemId: number): Promise<TrinketItemRow> {
	const result = await pool.query<TrinketItemRow>(
		`SELECT *
         FROM trinket_items
         WHERE id = $1`,
		[trinketItemId],
	);

	const trinketItem = result.rows[0];
	if (!trinketItem) translatePostgresError("getTrinketItemById", undefined, { notFound: true });
	return trinketItem;
}

export async function getTrinketItemByOrder(
	trinketId: number,
	itemOrder: number,
): Promise<TrinketItemRow> {
	const result = await pool.query<TrinketItemRow>(
		`SELECT *
         FROM trinket_items
         WHERE trinket_id = $1 AND item_order = $2`,
		[trinketId, itemOrder],
	);

	const trinketItem = result.rows[0];
	if (!trinketItem)
		translatePostgresError("getTrinketItemByOrder", undefined, { notFound: true });
	return trinketItem;
}

export async function getAllTrinketItems(trinketId: number): Promise<TrinketItemRow[]> {
	const result = await pool.query<TrinketItemRow>(
		`SELECT *
         FROM trinket_items
         WHERE trinket_id = $1`,
		[trinketId],
	);

	const trinketItems = result.rows;
	// if (trinketItems.length === 0)
	// 	translatePostgresError("getAllTrinketItems", undefined, { notFound: true });
	return trinketItems;
}

// ==================== UPDATE ====================

export async function reorderTrinketItems(
	trinketId: number,
	newOrderings: TrinketItemReorder[],
): Promise<TrinketItemRow[]> {
	const itemIds = newOrderings.map((ordering) => ordering.item_id);
	const reorders = newOrderings.map((ordering) => ordering.item_order);
	const result = await pool.query<TrinketItemRow>(
		`UPDATE trinket_items
         SET item_order = data.reorder
		 FROM (
		 	SELECT unnest($1::int[]) AS item_id, unnest($2::int[]) AS reorder
		 ) AS data
         WHERE trinket_items.id = item_id AND trinket_items.trinket_id = $3
         RETURNING *`,
		[itemIds, reorders, trinketId],
	);

	const trinketItems = result.rows;
	if (trinketItems.length === 0)
		translatePostgresError("reorderTrinketItems", undefined, { notFound: true });
	return trinketItems;
}

export async function changeTrinketItemTitle(
	trinketItemId: number,
	newTitle: string,
): Promise<TrinketItemRow> {
	const result = await pool.query<TrinketItemRow>(
		`UPDATE trinket_items
		 SET title = $1
		 WHERE id = $2
		 RETURNING *`,
		[newTitle, trinketItemId],
	);

	const trinketItem = result.rows[0];
	if (!trinketItem)
		translatePostgresError("changeTrinketItemTitle", undefined, { notFound: true });
	return trinketItem;
}

export async function changeTrinketItemDescription(
	trinketItemId: number,
	newDescription: string,
): Promise<TrinketItemRow> {
	const result = await pool.query<TrinketItemRow>(
		`UPDATE trinket_items
		 SET description = $1
		 WHERE id = $2
		 RETURNING *`,
		[newDescription, trinketItemId],
	);

	const trinketItem = result.rows[0];
	if (!trinketItem)
		translatePostgresError("changeTrinketItemDescription", undefined, { notFound: true });
	return trinketItem;
}

export async function changeTrinketItemMediaURL(
	trinketItemId: number,
	newMediaURL: string,
): Promise<{ trinketItem: TrinketItemRow; oldMediaURL: string | null }> {
	const before = await pool.query<TrinketItemRow>(
		`SELECT media_url
		 FROM trinket_items
		 WHERE id = $1`,
		[trinketItemId],
	);

	const beforeColumn = before.rows[0];
	if (!beforeColumn)
		translatePostgresError("changeTrinketItemMediaURL", undefined, { notFound: true });
	const oldMediaURL = beforeColumn.media_url ?? null;

	const result = await pool.query<TrinketItemRow>(
		`UPDATE trinket_items
		 SET media_url = $1
		 WHERE id = $2
		 RETURNING *`,
		[newMediaURL, trinketItemId],
	);

	const trinketItem = result.rows[0];
	if (!trinketItem)
		translatePostgresError("changeTrinketItemMediaURL", undefined, { notFound: true });
	return { trinketItem, oldMediaURL };
}

export async function changeTrinketItemMetadata(
	trinketItemId: number,
	metadata: JSONValue,
): Promise<{ trinketItem: TrinketItemRow; oldMetadata: JSONValue }> {
	const before = await pool.query<TrinketItemRow>(
		`SELECT metadata
		 FROM trinket_items
		 WHERE id = $1`,
		[trinketItemId],
	);

	const beforeColumn = before.rows[0];
	if (!beforeColumn)
		translatePostgresError("changeTrinketItemMetadata", undefined, { notFound: true });
	const oldMetadata = beforeColumn.metadata ?? null;

	const result = await pool.query<TrinketItemRow>(
		`UPDATE trinket_items
		 SET metadata = $1
		 WHERE id = $2
		 RETURNING *`,
		[metadata, trinketItemId],
	);

	const trinketItem = result.rows[0];
	if (!trinketItem)
		translatePostgresError("changeTrinketItemMetadata", undefined, { notFound: true });
	return { trinketItem, oldMetadata };
}

// ==================== DELETE ====================

export async function deleteTrinketItemTitle(trinketItemId: number): Promise<TrinketItemRow> {
	return await changeTrinketItemTitle(trinketItemId, "");
}

export async function deleteTrinketItemDescription(trinketItemId: number): Promise<TrinketItemRow> {
	return await changeTrinketItemDescription(trinketItemId, "");
}

// export async function deleteTrinketItemMediaURL(
// 	trinketItemId: number,
// ): Promise<{ trinketItem: TrinketItemRow; oldMediaURL: string | null }> {
// 	return await changeTrinketItemMediaURL(trinketItemId, "");
// }

export async function deleteTrinketItemMetadata(
	trinketItemId: number,
): Promise<{ trinketItem: TrinketItemRow; oldMetadata: JSONValue }> {
	return await changeTrinketItemMetadata(trinketItemId, null);
}

export async function deleteTrinketItem(trinketItemId: number): Promise<TrinketItemRow> {
	const result = await pool.query<TrinketItemRow>(
		`DELETE FROM trinket_items
		 WHERE id = $1
		 RETURNING *`,
		[trinketItemId],
	);

	const trinketItem = result.rows[0];
	if (!trinketItem) translatePostgresError("deleteTrinketItem", undefined, { notFound: true });

	const after = await pool.query(
		`UPDATE trinket_items
		 SET item_order = item_order - 1
		 WHERE trinket_id = $1 AND item_order > $2`,
		[trinketItem.trinket_id, trinketItem.item_order],
	);

	return trinketItem;
}

export async function deleteAllTrinketItems(trinketId: number): Promise<TrinketItemRow[]> {
	const result = await pool.query<TrinketItemRow>(
		`DELETE FROM trinket_items
		 WHERE trinket_id = $1
		 RETURNING *`,
		[trinketId],
	);

	const trinketItems = result.rows;
	// if (trinketItems.length === 0)
	// 	translatePostgresError("deleteAllTrinketItems", undefined, { notFound: true });
	return trinketItems;
}
