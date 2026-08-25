export interface TrinketSeal {
	grid: boolean[][];
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

// Helper to construct a horizontally mirrored grid
function generateGrid(size: number, rng: () => number): boolean[][] {
	const halfWidth = Math.ceil(size / 2);
	const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

	for (let row = 0; row < size; row++) {
		for (let col = 0; col < halfWidth; col++) {
			// ~45% active dots
			const isFilled = rng() > 0.55;
			grid[row][col] = isFilled;
			grid[row][size - 1 - col] = isFilled; // Mirror horizontally
		}
	}

	return grid;
}

/**
 * Generates a 9x9 Trinket Seal matrix
 */
export function generateTrinketCover(identifier: string): TrinketSeal {
	const cleanId = identifier.toLowerCase().trim();
	const seed = fnv1a(cleanId);
	const rng = mulberry32(seed);

	const SIZE = 9;
	const grid = generateGrid(SIZE, rng);

	const hue = Math.floor(rng() * 360);
	const color = `oklch(0.65 0.18 ${hue})`;

	return { grid, color };
}

/**
 * Generates a high-density 21x21 Dot Matrix for image loading states
 */
export function generateImageSeal(src: string): TrinketSeal {
	const cleanSrc = src.trim();
	const seed = fnv1a(cleanSrc);
	const rng = mulberry32(seed);

	const SIZE = 21;
	const grid = generateGrid(SIZE, rng);

	const hue = Math.floor(rng() * 360);
	const color = `oklch(0.65 0.18 ${hue})`;

	return { grid, color };
}
