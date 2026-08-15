import pool from "../config/postgres.ts";
import { translatePostgresError } from "../errors/PostgresError.ts";
import type { IslandRow, IslandVisibility, JSONValue } from "../types/types.ts";

// ======================== CREATE ===========================

export async function createIsland(
	userId: number,
	islandVisibility: IslandVisibility,
	name?: string,
	description?: string,
	coverURL?: string,
	metadata?: JSONValue,
): Promise<IslandRow> {
	try {
		const result = await pool.query<IslandRow>(
			`INSERT INTO islands(user_id, island_visibility, name, description, cover_url, metadata)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
			[userId, islandVisibility, name, description, coverURL, metadata],
		);

		const island = result.rows[0];
		if (!island) translatePostgresError("createIsland");
		return island;
	} catch (err: any) {
		translatePostgresError("createIsland", err);
	}
}

// ======================== READ ===========================

export async function getIslandByUserId(userId: number): Promise<IslandRow | null> {
	const result = await pool.query<IslandRow>(
		`SELECT *
         FROM islands
         WHERE user_id = $1`,
		[userId],
	);

	const island = result.rows[0] ?? null;
	// if (!island) translatePostgresError("getIslandByUserId");
	return island;
}

export async function getIslandByIslandId(islandId: number): Promise<IslandRow | null> {
	const result = await pool.query<IslandRow>(
		`SELECT *
         FROM islands
         WHERE id = $1`,
		[islandId],
	);

	const island = result.rows[0] ?? null;
	// if (!island) translatePostgresError("getIslandByIslandId");
	return island;
}

// ======================== UPDATE ===========================

export async function changeIslandVisibility(
	islandId: number,
	newVisibility: IslandVisibility,
): Promise<IslandRow> {
	const result = await pool.query<IslandRow>(
		`UPDATE islands
         SET island_visibility = $1
         WHERE id = $2
         RETURNING *`,
		[newVisibility, islandId],
	);

	const island = result.rows[0];
	if (!island) translatePostgresError("changeIslandVisibility");
	return island;
}

export async function changeIslandName(islandId: number, newName: string): Promise<IslandRow> {
	const result = await pool.query<IslandRow>(
		`UPDATE islands
         SET name = $1
         WHERE id = $2
         RETURNING *`,
		[newName, islandId],
	);

	const island = result.rows[0];
	if (!island) translatePostgresError("changeIslandName");
	return island;
}

export async function changeIslandDescription(
	islandId: number,
	newDescription: string,
): Promise<IslandRow> {
	const result = await pool.query<IslandRow>(
		`UPDATE islands
         SET description = $1
         WHERE id = $2
         RETURNING *`,
		[newDescription, islandId],
	);

	const island = result.rows[0];
	if (!island) translatePostgresError("changeIslandDescription");
	return island;
}

export async function changeIslandCoverURL(
	islandId: number,
	newCoverURL: string,
): Promise<{ island: IslandRow; oldCoverURL: string | null }> {
	const before = await pool.query<IslandRow>(
		`SELECT cover_url
         FROM islands
         WHERE id = $1`,
		[islandId],
	);

	const oldCoverURL = before.rows[0]?.cover_url ?? null;

	const result = await pool.query<IslandRow>(
		`UPDATE islands
         SET cover_url = $1
         WHERE id = $2
         RETURNING *`,
		[newCoverURL, islandId],
	);

	const island = result.rows[0];
	if (!island) translatePostgresError("changeIslandCoverURL");
	return { island, oldCoverURL };
}

export async function changeIslandMetadata(
	islandId: number,
	newMetadata: JSONValue,
): Promise<IslandRow> {
	const result = await pool.query<IslandRow>(
		`UPDATE islands
         SET metadata = $1
         WHERE id = $2
         RETURNING *`,
		[newMetadata, islandId],
	);

	const island = result.rows[0];
	if (!island) translatePostgresError("changeIslandMetadata");
	return island;
}

// ======================== DELETE ===========================

export async function deleteIslandName(islandId: number): Promise<IslandRow> {
	return await changeIslandName(islandId, "");
}

export async function deleteIslandDescription(islandId: number): Promise<IslandRow> {
	return await changeIslandDescription(islandId, "");
}
export async function deleteIslandCoverURL(
	islandId: number,
): Promise<{ island: IslandRow; oldCoverURL: string | null }> {
	return await changeIslandCoverURL(islandId, "");
}
export async function deleteIslandMetadata(islandId: number): Promise<IslandRow> {
	return await changeIslandMetadata(islandId, null);
}
export async function deleteIsland(islandId: number): Promise<IslandRow> {
	const result = await pool.query<IslandRow>(
		`DELETE FROM islands
         WHERE id = $1
         RETURNING *`,
		[islandId],
	);
	const island = result.rows[0];
	if (!island) translatePostgresError("deleteIsland");
	return island;
}
