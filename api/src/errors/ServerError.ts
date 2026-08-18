export class ServerError extends Error {
	public code: ServerErrorCode;
	constructor(code: ServerErrorCode, message: string) {
		super(message);
		this.name = "ServerError";
		this.code = code;
	}
}

export const ServerErrorCode = {
	INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
	MISSING_TOKEN: "MISSING_TOKEN",
	INVALID_TOKEN: "INVALID_TOKEN",

	EMAIL_IN_USE: "EMAIL_IN_USE",
	USERNAME_IN_USE: "USERNAME_IN_USE",
	USERNAME_RESERVED: "USERNAME_RESERVED",
	CONFLICT: "CONFLICT",

	INVALID_REFERENCE: "INVALID_REFERENCE",
	MISSING_FIELD: "MISSING_FIELD",
	INVALID_INPUT: "INVALID_INPUT",
	VALUE_TOO_LONG: "VALUE_TOO_LONG",
	PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",

	ACCESS_DENIED: "ACCESS_DENIED",

	NOT_FOUND: "NOT_FOUND",

	INSUFFICIENT_STORAGE: "INSUFFICIENT_STORAGE",

	DATABASE_FAILURE: "DATABASE_FAILURE",
	INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ServerErrorCode = (typeof ServerErrorCode)[keyof typeof ServerErrorCode];

export const ServerErrorStatus: Record<ServerErrorCode, number> = {
	[ServerErrorCode.USERNAME_RESERVED]: 400,
	[ServerErrorCode.VALUE_TOO_LONG]: 400,
	[ServerErrorCode.INVALID_REFERENCE]: 400,
	[ServerErrorCode.MISSING_FIELD]: 400,
	[ServerErrorCode.INVALID_INPUT]: 400,

	[ServerErrorCode.INVALID_CREDENTIALS]: 401,
	[ServerErrorCode.MISSING_TOKEN]: 401,
	[ServerErrorCode.INVALID_TOKEN]: 401,

	[ServerErrorCode.ACCESS_DENIED]: 403,

	[ServerErrorCode.PAYLOAD_TOO_LARGE]: 413,

	[ServerErrorCode.NOT_FOUND]: 404,

	[ServerErrorCode.EMAIL_IN_USE]: 409,
	[ServerErrorCode.USERNAME_IN_USE]: 409,
	[ServerErrorCode.CONFLICT]: 409,

	[ServerErrorCode.INTERNAL_ERROR]: 500,
	[ServerErrorCode.DATABASE_FAILURE]: 500,

	[ServerErrorCode.INSUFFICIENT_STORAGE]: 507,
};
