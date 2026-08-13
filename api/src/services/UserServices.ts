import { RESERVED_USERNAMES, FieldLengths } from "../constants/businessLogic.ts";
import { SALT_ROUNDS } from "../constants/saltRounds.ts";

import { ServerError, ServerErrorCode } from "../errors/ServerError.ts";
import {
	createUser,
	getUserById,
	getUserByEmail,
	getUserByUsername,
	getUserHashedPassword,
	changeUserUsername,
	changeUserName,
	changeUserEmail,
	changeUserPassword,
	changeUserPhotograph,
	changeUserSeal,
} from "../models/User.ts";
import {
	LoginMethod,
	type LoginInput,
	type MediaInput,
	type PublicUser,
	type SignupInput,
} from "../types/types.ts";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.ts";
import { deleteFromR2Service } from "./CloudflareServices.ts";

// =================  AUTH ===================

export async function singupService(input: SignupInput) {
	requireName(input.name);

	requireEmail(input.email);
	await requireUniqueEmail(input.email);

	requireUsername(input.username);
	await requireUniqueUsername(input.username);

	requirePassword(input.password);
	const passwordHash = await hashPassword(input.password);

	const user = await createUser(input.name, input.username, input.email, passwordHash);
	const token = signToken(user.id);
	return { token, user };
}

export async function loginService({ login_method, identification, password }: LoginInput) {
	if (login_method === LoginMethod.email) {
		requireEmail(identification);
	} else if (login_method === LoginMethod.username) {
		requireUsername(identification);
	}

	const user =
		login_method === LoginMethod.email
			? await getUserByEmail(identification)
			: login_method === LoginMethod.username
				? await getUserByUsername(identification)
				: null;

	if (!user) throw new ServerError(ServerErrorCode.INVALID_CREDENTIALS, "loginService");

	await requireCorrectPassword(user.id, password);

	const token = signToken(user.id);
	return { token, user };
}

export async function meService(userId: number) {
	const user = await getUserById(userId);
	if (!user) throw new ServerError(ServerErrorCode.INVALID_REFERENCE, "meService");
	return user;
}

// ===================== USER ====================

export async function changeNameService(userId: number, newName: string): Promise<PublicUser> {
	requireName(newName);
	const user = await changeUserName(userId, newName);
	return user;
}

export async function changeUsernameService(
	userId: number,
	newUsername: string,
): Promise<PublicUser> {
	requireUsername(newUsername);
	await requireUniqueUsername(newUsername);
	const user = await changeUserUsername(userId, newUsername);
	return user;
}

export async function changeEmailService(userId: number, email: string): Promise<PublicUser> {
	requireEmail(email);
	const user = await changeUserEmail(userId, email);
	return user;
}

export async function changePasswordService(
	userId: number,
	oldPassword: string,
	newPassword: string,
): Promise<PublicUser> {
	requirePassword(oldPassword);
	requirePassword(newPassword);
	requireDifferentPassword(oldPassword, newPassword);
	await requireCorrectPassword(userId, oldPassword);

	const passwordHash = await hashPassword(newPassword);
	const user = await changeUserPassword(userId, newPassword);

	return user;
}

export async function changePhotographService(
	userId: number,
	input: MediaInput,
): Promise<PublicUser> {
	requireMedia(input);
	const { user, oldPhotographURL } = await changeUserPhotograph(userId, input.media_url);
	if (oldPhotographURL) await deleteFromR2Service(oldPhotographURL);

	return user;
}

export async function changeSealService(userId: number, input: MediaInput): Promise<PublicUser> {
	requireMedia(input);
	const { user, oldSealURL } = await changeUserSeal(userId, input.media_url);
	if (oldSealURL) await deleteFromR2Service(oldSealURL);

	return user;
}

// ================= REQUIRES ====================

function requireName(name: string) {
	if (!name || name.trim().length === 0)
		throw new ServerError(ServerErrorCode.MISSING_FIELD, "requireName");
	else if (name.trim().length > FieldLengths.NAME)
		throw new ServerError(ServerErrorCode.VALUE_TOO_LONG, "requireName");
}

function requireEmail(email: string) {
	if (!email || email.trim().length === 0)
		throw new ServerError(ServerErrorCode.MISSING_FIELD, "requireEmail");
	else if (email.trim().length > FieldLengths.EMAIL)
		throw new ServerError(ServerErrorCode.VALUE_TOO_LONG, "requireEmail");
}

function requireUsername(username: string) {
	if (!username || username.trim().length === 0)
		throw new ServerError(ServerErrorCode.MISSING_FIELD, "requireUsername");
	else if (username.trim().length > FieldLengths.USERNAME)
		throw new ServerError(ServerErrorCode.VALUE_TOO_LONG, "requireUsername");
}

function requirePassword(password: string) {
	if (!password || password.trim().length === 0)
		throw new ServerError(ServerErrorCode.MISSING_FIELD, "requirePassword");
	else if (password.trim().length > FieldLengths.PASSWORD)
		throw new ServerError(ServerErrorCode.VALUE_TOO_LONG, "requirePassword");
}

function requireDifferentPassword(oldPassword: string, newPassword: string) {
	if (oldPassword === newPassword)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "requireDifferentPassword");
}

async function requireCorrectPassword(userId: number, password: string) {
	const passwordHash = await getUserHashedPassword(userId);
	const match = await bcrypt.compare(password, passwordHash);
	if (!match) throw new ServerError(ServerErrorCode.INVALID_CREDENTIALS, "loginService");
}

async function hashPassword(password: string) {
	const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
	return passwordHash;
}

async function requireUniqueEmail(email: string) {
	if (await getUserByEmail(email))
		throw new ServerError(ServerErrorCode.EMAIL_IN_USE, "requireUniqueEmail");
}

async function requireUniqueUsername(username: string) {
	if (await getUserByUsername(username))
		throw new ServerError(ServerErrorCode.USERNAME_IN_USE, "requireUniqueUsername");
	if (RESERVED_USERNAMES.has(username.toLowerCase()))
		throw new ServerError(ServerErrorCode.USERNAME_RESERVED, "requireUnreservedUsername");
}

function requireMedia(input: MediaInput) {
	if (!input.media_url || input.media_url.trim().length === 0)
		throw new ServerError(ServerErrorCode.MISSING_FIELD, "requireMedia");
	if (input.media_size_bytes <= 0)
		throw new ServerError(ServerErrorCode.MISSING_FIELD, "requireMedia");
}
