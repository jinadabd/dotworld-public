export const RESERVED_USERNAMES = new Set([
	"auth",
	"island",
	"islands",
	"trinket",
	"trinkets",
	"friend",
	"friends",
	"chatter",
	"bubble",
	"bubbles",
	"compose",
	"posts",
	"users",
	"uploads",
	"settings",
	"about",
	"welcome",
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
