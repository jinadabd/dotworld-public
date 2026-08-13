import jwt from "jsonwebtoken";

export function signToken(userId: number): string {
	return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "30d" });
}
