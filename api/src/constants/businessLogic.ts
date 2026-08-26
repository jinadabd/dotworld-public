export const RESERVED_USERNAMES = new Set([
	"auth",
	"admin",
	"dotworld",
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
	NAME: 25,
	USERNAME: 15,
	EMAIL: 100,
	PASSWORD: 30,
} as const;

export type FieldLengths = (typeof FieldLengths)[keyof typeof FieldLengths];

export const MAX_POST_BUBBLES = 3;
