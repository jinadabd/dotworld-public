export const RESERVED_USERNAMES = new Set([
	"auth",
	"bubbles",
	"chatter",
	"compose",
	"settings",
	"about",
	"help",
]);

export const FieldLengths = {
	NAME: 50,
	USERNAME: 255,
	EMAIL: 255,
	PASSWORD: 255,
} as const;

export type FieldLengths = (typeof FieldLengths)[keyof typeof FieldLengths];

export const MAX_POST_BUBBLES = 3;
