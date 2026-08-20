import pool from "../config/postgres.ts";
import type { PublicUser } from "../types/types.ts";
import { translatePostgresError } from "../errors/PostgresError.ts";

const PublicUserColumns =
	"id, name, username, email, photograph_url, seal_url, storage_used_bytes, created_at";

// ==================== CREATE ====================

export async function createUser(
	name: string,
	username: string,
	email: string,
	passwordHash: string,
): Promise<PublicUser> {
	try {
		const result = await pool.query<PublicUser>(
			`INSERT INTO users(name, username, email, password_hash)
         	 VALUES ($1, $2, $3, $4) 
         	 RETURNING ${PublicUserColumns}`,
			[name, username, email, passwordHash],
		);

		const user = result.rows[0];
		if (!user) translatePostgresError("createUser");
		return user;
	} catch (err: any) {
		translatePostgresError("createUser", err);
	}
}

// ==================== READ ====================

export async function getUserByUsername(username: string): Promise<PublicUser | null> {
	const result = await pool.query<PublicUser>(
		`SELECT ${PublicUserColumns} FROM users
         WHERE username = $1`,
		[username],
	);

	const user = result.rows[0] ?? null;
	return user;
}

export async function getUserByEmail(email: string): Promise<PublicUser | null> {
	const result = await pool.query<PublicUser>(
		`SELECT ${PublicUserColumns} FROM users
         WHERE email = $1`,
		[email],
	);

	const user = result.rows[0] ?? null;
	return user;
}

export async function getUserById(id: number): Promise<PublicUser> {
	const result = await pool.query<PublicUser>(
		`SELECT ${PublicUserColumns} FROM users
         WHERE id = $1`,
		[id],
	);

	const user = result.rows[0];
	if (!user) translatePostgresError("getUserById", undefined, { notFound: true });
	return user;
}

export async function searchUsersByUsername(
	prefix: string,
	excludeUserId: number,
): Promise<PublicUser[]> {
	const result = await pool.query<PublicUser>(
		`SELECT ${PublicUserColumns} FROM users
		 WHERE username ILIKE $1 || '%'
		 AND id != $2
		 ORDER by username
		 LIMIT 10`,
		[prefix, excludeUserId],
	);

	return result.rows;
}

export async function getUserHashedPassword(userId: number): Promise<string> {
	const before = await pool.query<{ password_hash: string }>(
		`SELECT password_hash FROM users
         WHERE id = $1`,
		[userId],
	);

	const result = before.rows[0];
	if (!result) translatePostgresError("getUserHashedPassword", undefined, { notFound: true });
	return result.password_hash;
}

// ==================== UPDATE ====================

export async function changeUserName(userId: number, newNname: string): Promise<PublicUser> {
	const result = await pool.query<PublicUser>(
		`UPDATE users
         SET name = $1
         WHERE id = $2
         RETURNING ${PublicUserColumns}`,
		[newNname, userId],
	);

	const user = result.rows[0];
	if (!user) translatePostgresError("changeUserName", undefined, { notFound: true });
	return user;
}

export async function changeUserUsername(userId: number, newUsername: string): Promise<PublicUser> {
	try {
		const result = await pool.query<PublicUser>(
			`UPDATE users
         	 SET username = $1
         	 WHERE id = $2
         	 RETURNING ${PublicUserColumns}`,
			[newUsername, userId],
		);

		const user = result.rows[0];
		if (!user) translatePostgresError("changeUserUsername", undefined, { notFound: true });
		return user;
	} catch (err: any) {
		translatePostgresError("changeUserUsername", err);
	}
}

export async function changeUserEmail(userId: number, newEmail: string): Promise<PublicUser> {
	try {
		const result = await pool.query<PublicUser>(
			`UPDATE users
         	 SET email = $1
         	 WHERE id = $2
         	 RETURNING ${PublicUserColumns}`,
			[newEmail, userId],
		);

		const user = result.rows[0];
		if (!user) translatePostgresError("changeUserEmail", undefined, { notFound: true });
		return user;
	} catch (err: any) {
		translatePostgresError("changeUserEmail", err);
	}
}

export async function changeUserPassword(
	userId: number,
	newPasswordHash: string,
): Promise<PublicUser> {
	const result = await pool.query<PublicUser>(
		`UPDATE users
		 SET password_hash = $1
		 WHERE id = $2
		 RETURNING ${PublicUserColumns}`,
		[newPasswordHash, userId],
	);

	const user = result.rows[0];
	if (!user) translatePostgresError("changeUserPassword", undefined, { notFound: true });
	return user;
}

export async function changeUserPhotograph(
	userId: number,
	newPhotographURL: string,
): Promise<{ user: PublicUser; oldPhotographURL: string | null }> {
	const before = await pool.query<{ photograph_url: string }>(
		`SELECT photograph_url
		 FROM users
		 WHERE id = $1`,
		[userId],
	);

	const beforeColumn = before.rows[0];
	if (!beforeColumn)
		translatePostgresError("changeUserPhotograph", undefined, { notFound: true });
	const oldPhotographURL = beforeColumn.photograph_url ?? null;

	const result = await pool.query<PublicUser>(
		`UPDATE users
		 SET photograph_url = $1
		 WHERE id = $2
		 RETURNING ${PublicUserColumns}`,
		[newPhotographURL, userId],
	);

	const user = result.rows[0];
	if (!user) translatePostgresError("changeUserPhotograph", undefined, { notFound: true });

	return { user: user, oldPhotographURL: oldPhotographURL };
}

export async function changeUserSeal(
	userId: number,
	newSealURL: string,
): Promise<{ user: PublicUser; oldSealURL: string | null }> {
	const before = await pool.query<{ seal_url: string }>(
		`SELECT seal_url
		 FROM users
		 WHERE id = $1`,
		[userId],
	);

	const beforeColumn = before.rows[0];
	if (!beforeColumn) translatePostgresError("changeUserSeal", undefined, { notFound: true });
	const oldSealURL = beforeColumn.seal_url ?? null;

	const result = await pool.query<PublicUser>(
		`UPDATE users
		 SET seal_url = $1
		 WHERE id = $2
		 RETURNING ${PublicUserColumns}`,
		[newSealURL, userId],
	);

	const user = result.rows[0];
	if (!user) translatePostgresError("changeUserSeal", undefined, { notFound: true });

	return { user: user, oldSealURL: oldSealURL };
}

async function changeUserStorage(userId: number, difference: number): Promise<PublicUser> {
	const result = await pool.query<PublicUser>(
		`UPDATE users
		 SET storage_used_bytes = storage_used_bytes + $1
		 WHERE id = $2
		 RETURNING ${PublicUserColumns}`,
		[difference, userId],
	);

	const user = result.rows[0];
	if (!user) translatePostgresError("changeUserStorage", undefined, { notFound: true });

	return user;
}

export async function incrementUserStorage(
	userId: number,
	difference: number,
): Promise<PublicUser> {
	if (!difference || difference <= 0)
		translatePostgresError("incrementUserStorage", undefined, { badParam: true });
	return await changeUserStorage(userId, difference);
}

export async function decrementUserStorage(
	userId: number,
	difference: number,
): Promise<PublicUser> {
	if (!difference || difference <= 0)
		translatePostgresError("decrementUserStorage", undefined, { badParam: true });
	return await changeUserStorage(userId, -difference);
}

// ==================== DELETE ====================

export async function deleteUserPhotograph(
	userId: number,
): Promise<{ user: PublicUser; oldPhotographURL: string | null }> {
	const before = await pool.query<{ photograph_url: string }>(
		`SELECT photograph_url
		 FROM users
		 WHERE id = $1`,
		[userId],
	);

	const beforeColumn = before.rows[0];
	if (!beforeColumn)
		translatePostgresError("deleteUserPhotograph", undefined, { notFound: true });
	const oldPhotographURL = beforeColumn.photograph_url ?? null;

	const result = await pool.query<PublicUser>(
		`UPDATE users
		 SET photograph_url = NULL
		 WHERE id = $1
		 RETURNING ${PublicUserColumns}`,
		[userId],
	);

	const user = result.rows[0];
	if (!user) translatePostgresError("deleteUserPhotograph", undefined, { notFound: true });

	return { user: user, oldPhotographURL: oldPhotographURL };
}

export async function deleteUserSeal(
	userId: number,
): Promise<{ user: PublicUser; oldSealURL: string | null }> {
	const before = await pool.query<{ seal_url: string }>(
		`SELECT seal_url
		 FROM users
		 WHERE id = $1`,
		[userId],
	);

	const beforeColumn = before.rows[0];
	if (!beforeColumn) translatePostgresError("deleteUserSeal", undefined, { notFound: true });
	const oldSealURL = beforeColumn.seal_url ?? null;

	const result = await pool.query<PublicUser>(
		`UPDATE users
		 SET seal_url = NULL
		 WHERE id = $1
		 RETURNING ${PublicUserColumns}`,
		[userId],
	);

	const user = result.rows[0];
	if (!user) translatePostgresError("deleteUserSeal", undefined, { notFound: true });

	return { user: user, oldSealURL: oldSealURL };
}

export async function deleteUser(userId: number): Promise<PublicUser> {
	const result = await pool.query(
		`DELETE FROM users
		 WHERE id = $1
		 RETURNING ${PublicUserColumns}`,
		[userId],
	);

	if (result.rowCount !== 1) translatePostgresError("deleteUser", undefined, { notFound: true });

	const user = result.rows[0];
	if (!user) translatePostgresError("deleteUser", undefined, { notFound: true });

	return user;
}
