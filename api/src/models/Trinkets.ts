import pool from "../config/postgres.ts";
import { translatePostgresError } from "../errors/PostgresError.ts";
import type { JSONValue, TrinketRow, TrinketType, TrinketVisibility } from "../types/types.ts";

// ==================== CREATE ====================

export async function createTrinket(
	userId: number,
	trinketVisibility: TrinketVisibility,
	trinketType: TrinketType,
	title: string,
	description?: string,
	coverURL?: string,
	metadata?: JSONValue,
): Promise<TrinketRow> {
	try {
		const result = await pool.query<TrinketRow>(
			`INSERT INTO trinkets(user_id, trinket_visibility, trinket_type, title, description, cover_url, metadata)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
			[
				userId,
				trinketVisibility,
				trinketType,
				title,
				description ?? "",
				coverURL ?? "",
				metadata ?? JSON.parse("{}"),
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

export async function getTrinket(trinketId: number): Promise<TrinketRow> {
	const result = await pool.query<TrinketRow>(
		`SELECT *
         FROM trinkets
         WHERE id = $1`,
		[trinketId],
	);

	const trinket = result.rows[0];
	if (!trinket) translatePostgresError("getTrinket");
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
	if (trinket.length === 0) translatePostgresError("getAllTrinketsByUserId");
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
): Promise<TrinketRow> {
	const result = await pool.query<TrinketRow>(
		`UPDATE trinkets
         SET cover_url = $1
         WHERE id = $2
         RETURNING *`,
		[coverURL, trinketId],
	);

	const trinket = result.rows[0];
	if (!trinket) translatePostgresError("changeTrinketCoverURL", undefined, { notFound: true });
	return trinket;
}

export async function changeTrinketMetadata(
	trinketId: number,
	metadata: string,
): Promise<TrinketRow> {
	const result = await pool.query<TrinketRow>(
		`UPDATE trinkets
         SET metadata = $1
         WHERE id = $2
         RETURNING *`,
		[metadata, trinketId],
	);

	const trinket = result.rows[0];
	if (!trinket) translatePostgresError("changeTrinketMetadata", undefined, { notFound: true });
	return trinket;
}

// ==================== DELETE ====================

export async function deleteTrinketDescription(trinketId: number): Promise<TrinketRow> {
	return await changeTrinketDescription(trinketId, "");
}

export async function deleteTrinketCoverURL(trinketId: number): Promise<TrinketRow> {
	return await changeTrinketCoverURL(trinketId, "");
}

export async function deleteTrinketMetadata(trinketId: number): Promise<TrinketRow> {
	return await changeTrinketMetadata(trinketId, JSON.parse("{}"));
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
