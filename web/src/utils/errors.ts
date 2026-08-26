import { ServerErrorCode } from "@shared/ServerErrorCode";

const ErrorMessages: Record<ServerErrorCode, string> = {
	[ServerErrorCode.USERNAME_RESERVED]: "This username is reserved. Try another one.",
	[ServerErrorCode.VALUE_TOO_LONG]: "One of the fields you entered is too long.",
	[ServerErrorCode.INVALID_REFERENCE]: "INVALID_REFERENCE",
	[ServerErrorCode.MISSING_FIELD]: "Make sure you've filled out all the fields.",
	[ServerErrorCode.INVALID_INPUT]: "Whatever you tried to do is not possible.",

	[ServerErrorCode.INVALID_CREDENTIALS]: "Incorrect username, email, or password.",
	[ServerErrorCode.MISSING_TOKEN]: "MISSING_TOKEN",
	[ServerErrorCode.INVALID_TOKEN]: "INVALID_TOKEN",

	[ServerErrorCode.ACCESS_DENIED]: "Nuh-uh. You do not have permission to do that.",
	[ServerErrorCode.NOT_FOUND]: "We tried our best, but couldn't find that. Sorry :(",
	[ServerErrorCode.PAYLOAD_TOO_LARGE]: "File way too big. Try another one.",

	[ServerErrorCode.EMAIL_IN_USE]: "That email is already registered.",
	[ServerErrorCode.USERNAME_IN_USE]: "That username is taken. Try another one.",
	[ServerErrorCode.CONFLICT]: "CONFLICT",

	[ServerErrorCode.INTERNAL_ERROR]: "INTERNAL_ERROR",
	[ServerErrorCode.DATABASE_FAILURE]: "DATABASE_FAILURE",

	[ServerErrorCode.INSUFFICIENT_STORAGE]:
		"This isn't Google Drive, bro. No more storage for you.",
};

export function extractErrorMessage(error: unknown) {
	if (error && typeof error === "object" && "data" in error) {
		const code = (error as any).data?.code as ServerErrorCode;
		if (code && ErrorMessages[code]) return ErrorMessages[code];
		return "Something went wrong.";
	}
}
