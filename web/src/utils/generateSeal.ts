export interface UserSeal {
	grid: boolean[][]; // 5x5 matrix
	color: string; // Hex or OKLCH accent color derived from hash
}

export async function generateUserSeal(identifier: string): Promise<UserSeal> {
	// 1. Hash the string (e.g. username or userId) using SHA-256
	const encoder = new TextEncoder();
	const data = encoder.encode(identifier.toLowerCase().trim());
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));

	// 2. Generate a 5x5 vertically symmetric grid
	// We only need 3 columns (left, center, right is mirrored left)
	const grid: boolean[][] = Array.from({ length: 5 }, () => Array(5).fill(false));

	let bitIndex = 0;
	for (let row = 0; row < 5; row++) {
		for (let col = 0; col < 3; col++) {
			// Use bytes from the hash to decide active state
			const byte = hashArray[bitIndex % hashArray.length];
			const isFilled = (byte & (1 << (bitIndex % 8))) !== 0;

			grid[row][col] = isFilled;
			grid[row][4 - col] = isFilled; // Mirror to right side

			bitIndex++;
		}
	}

	// 3. Derive a consistent accent color from the tail bytes
	const hue = hashArray[16] % 360;
	const color = `oklch(0.65 0.18 ${hue})`;

	return { grid, color };
}
