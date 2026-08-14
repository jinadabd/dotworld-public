import { ServerError, ServerErrorCode } from "./ServerError.ts";

export function translatePostgresError(
	src: string,
	err?: any,
	reason?: { notFound?: boolean; badParam?: boolean },
): never {
	if (!err && !reason) {
		throw new ServerError(ServerErrorCode.DATABASE_FAILURE, src);
	} else if (reason?.notFound) {
		throw new ServerError(ServerErrorCode.NOT_FOUND, src);
	} else if (reason?.badParam) {
		throw new ServerError(ServerErrorCode.INVALID_INPUT, src);
	}

	let errorCode: ServerErrorCode;

	switch (err.code) {
		case PostgresErrorCode.NOT_NULL_VIOLATION:
			errorCode = ServerErrorCode.MISSING_FIELD;
			break;
		case PostgresErrorCode.FOREIGN_KEY_VIOLATION:
			errorCode = ServerErrorCode.INVALID_REFERENCE;
			break;
		case PostgresErrorCode.UNIQUE_VIOLATION:
			if (err.constraint?.includes("email")) errorCode = ServerErrorCode.EMAIL_IN_USE;
			else if (err.constraint?.includes("username"))
				errorCode = ServerErrorCode.USERNAME_IN_USE;
			else errorCode = ServerErrorCode.CONFLICT;
			break;
		case PostgresErrorCode.STRING_TOO_LONG:
			errorCode = ServerErrorCode.VALUE_TOO_LONG;
			break;
		default:
			throw err;
	}

	throw new ServerError(errorCode, src);
}

export const PostgresErrorCode = {
	NOT_NULL_VIOLATION: 23502,
	FOREIGN_KEY_VIOLATION: 23503,
	UNIQUE_VIOLATION: 23505,
	// CHECK_VIOLATION: 23514,
	STRING_TOO_LONG: 22001,
} as const;

export type PostgresErrorCode = (typeof PostgresErrorCode)[keyof typeof PostgresErrorCode];
