import pool from "../config/postgres.ts";
import { translatePostgresError } from "../errors/PostgresError.ts";
import type { JSONValue, TrinketRow, TrinketType, TrinketVisibility } from "../types/types.ts";

// ==================== CREATE ====================

export async function createTrinket(
	userId: number,
	trinketVisibility: TrinketVisibility,
	trinketType: TrinketType,
	title: string,
	fileSizeBytes: number,
	description?: string,
	coverURL?: string,
	metadata?: JSONValue,
): Promise<TrinketRow> {
	try {
		const result = await pool.query<TrinketRow>(
			`INSERT INTO trinkets(user_id, trinket_visibility, trinket_type, title, description, cover_url, metadata, file_size_bytes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
			[
				userId,
				trinketVisibility,
				trinketType,
				title,
				description ?? "",
				coverURL ?? "",
				metadata,
				fileSizeBytes,
			],
		);

		const trinket = result.rows[0];
		if (!trinket) translatePostgresError("createTrinket");
		return trinket;
	} catch (err: any) {
		translatePostgresError("createTrinket", err);
	}
}

// ==================== READ ====================

export async function getTrinketById(trinketId: number): Promise<TrinketRow> {
	const result = await pool.query<TrinketRow>(
		`SELECT *
         FROM trinkets
         WHERE id = $1`,
		[trinketId],
	);

	const trinket = result.rows[0];
	if (!trinket) translatePostgresError("getTrinketById", undefined, { notFound: true });
	return trinket;
}

export async function getAllTrinketsByUserId(userId: number): Promise<TrinketRow[]> {
	const result = await pool.query<TrinketRow>(
		`SELECT *
         FROM trinkets
         WHERE user_id = $1`,
		[userId],
	);

	const trinket = result.rows;
	return trinket;
}

// ==================== UPDATE ====================

export async function changeTrinketVisibility(
	trinketId: number,
	newVisibility: TrinketVisibility,
): Promise<TrinketRow> {
	const result = await pool.query<TrinketRow>(
		`UPDATE trinkets
         SET trinket_visibility = $1
         WHERE id = $2
         RETURNING *`,
		[newVisibility, trinketId],
	);

	const trinket = result.rows[0];
	if (!trinket) translatePostgresError("changeTrinketVisibility", undefined, { notFound: true });
	return trinket;
}

export async function featureTrinket(trinketId: number): Promise<TrinketRow> {
	const result = await pool.query<TrinketRow>(
		`UPDATE trinkets
         SET featured = true
         WHERE id = $1
         RETURNING *`,
		[trinketId],
	);

	const trinket = result.rows[0];
	if (!trinket) translatePostgresError("featureTrinket", undefined, { notFound: true });
	return trinket;
}

export async function unfeatureTrinket(trinketId: number): Promise<TrinketRow> {
	const result = await pool.query<TrinketRow>(
		`UPDATE trinkets
         SET featured = false
         WHERE id = $1
         RETURNING *`,
		[trinketId],
	);

	const trinket = result.rows[0];
	if (!trinket) translatePostgresError("unfeatureTrinket", undefined, { notFound: true });
	return trinket;
}

export async function changeTrinketTitle(trinketId: number, title: string): Promise<TrinketRow> {
	const result = await pool.query<TrinketRow>(
		`UPDATE trinkets
         SET title = $1
         WHERE id = $2
         RETURNING *`,
		[title, trinketId],
	);

	const trinket = result.rows[0];
	if (!trinket) translatePostgresError("changeTrinketTitle", undefined, { notFound: true });
	return trinket;
}

export async function changeTrinketDescription(
	trinketId: number,
	description: string,
): Promise<TrinketRow> {
	const result = await pool.query<TrinketRow>(
		`UPDATE trinkets
         SET description = $1
         WHERE id = $2
         RETURNING *`,
		[description, trinketId],
	);

	const trinket = result.rows[0];
	if (!trinket) translatePostgresError("changeTrinketDescription", undefined, { notFound: true });
	return trinket;
}

export async function changeTrinketCoverURL(
	trinketId: number,
	coverURL: string,
	fileSizeBytes: number,
): Promise<{ trinket: TrinketRow; oldCoverURL: string | null }> {
	const before = await pool.query<TrinketRow>(
		`SELECT cover_url
		 FROM trinkets
		 WHERE id = $1`,
		[trinketId],
	);

	const beforeColumn = before.rows[0];
	if (!beforeColumn)
		translatePostgresError("changeTrinketCoverURL", undefined, { notFound: true });
	const oldCoverURL = beforeColumn.cover_url ?? null;

	const result = await pool.query<TrinketRow>(
		`UPDATE trinkets
         SET cover_url = $1, file_size_bytes = $2
         WHERE id = $3
         RETURNING *`,
		[coverURL, fileSizeBytes, trinketId],
	);

	const trinket = result.rows[0];
	if (!trinket) translatePostgresError("changeTrinketCoverURL", undefined, { notFound: true });
	return { trinket, oldCoverURL };
}

export async function changeTrinketMetadata(
	trinketId: number,
	metadata: JSONValue,
): Promise<{ trinket: TrinketRow; oldMetadata: JSONValue }> {
	const before = await pool.query<TrinketRow>(
		`SELECT metadata
		 FROM trinkets
		 WHERE id = $1`,
		[trinketId],
	);

	const beforeColumn = before.rows[0];
	if (!beforeColumn)
		translatePostgresError("changeTrinketMetadata", undefined, { notFound: true });
	const oldMetadata = beforeColumn.metadata ?? null;

	const result = await pool.query<TrinketRow>(
		`UPDATE trinkets
         SET metadata = $1
         WHERE id = $2
         RETURNING *`,
		[metadata, trinketId],
	);

	const trinket = result.rows[0];
	if (!trinket) translatePostgresError("changeTrinketMetadata", undefined, { notFound: true });
	return { trinket, oldMetadata };
}

// ==================== DELETE ====================

export async function deleteTrinketDescription(trinketId: number): Promise<TrinketRow> {
	return await changeTrinketDescription(trinketId, "");
}

export async function deleteTrinketCoverURL(
	trinketId: number,
): Promise<{ trinket: TrinketRow; oldCoverURL: string | null }> {
	return await changeTrinketCoverURL(trinketId, "", 0);
}

export async function deleteTrinketMetadata(
	trinketId: number,
): Promise<{ trinket: TrinketRow; oldMetadata: JSONValue }> {
	return await changeTrinketMetadata(trinketId, null);
}

export async function deleteTrinket(trinketId: number): Promise<TrinketRow> {
	const result = await pool.query<TrinketRow>(
		`DELETE FROM trinkets
         WHERE id = $1
         RETURNING *`,
		[trinketId],
	);

	const trinket = result.rows[0];
	if (!trinket) translatePostgresError("deleteTrinket", undefined, { notFound: true });
	return trinket;
}
