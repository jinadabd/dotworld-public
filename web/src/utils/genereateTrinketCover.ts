export interface TrinketSeal {
	grid: boolean[][]; // 13x13 matrix
	color: string;
}

// 32-bit FNV-1a hash to create a seed integer
function fnv1a(str: string): number {
	let hash = 2166136261;
	for (let i = 0; i < str.length; i++) {
		hash ^= str.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
}

// Mulberry32: High-quality 32-bit pseudo-random generator
function mulberry32(a: number) {
	return function () {
		let t = (a += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function generateTrinketCover(identifier: string): TrinketSeal {
	const cleanId = identifier.toLowerCase().trim();
	const seed = fnv1a(cleanId);
	const rng = mulberry32(seed);

	const SIZE = 13;
	const HALF_WIDTH = Math.ceil(SIZE / 2); // 7 columns
	const grid: boolean[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));

	for (let row = 0; row < SIZE; row++) {
		for (let col = 0; col < HALF_WIDTH; col++) {
			// Threshold controls density (~45% active dots for balanced visuals)
			const isFilled = rng() > 0.55;
			grid[row][col] = isFilled;
			grid[row][SIZE - 1 - col] = isFilled; // Mirror horizontally
		}
	}

	const hue = Math.floor(rng() * 360);
	const color = `oklch(0.65 0.18 ${hue})`;

	return { grid, color };
}
