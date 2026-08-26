export interface DynamicSeal {
	grid: boolean[][];
	color: string;
	rows: number;
	cols: number;
}

function fnv1a(str: string): number {
	let hash = 2166136261;
	for (let i = 0; i < str.length; i++) {
		hash ^= str.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
}

function mulberry32(a: number) {
	return function () {
		let t = (a += 0x6d2b79f5);
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

interface MatrixOptions {
	inputLength: number;
	viewportWidth: number;
	viewportHeight: number;
	fallbackSeed?: string;
}

export function generateDynamicSeal(textInput: string, options: MatrixOptions): DynamicSeal {
	const { viewportWidth, viewportHeight, fallbackSeed = "default" } = options;
	const len = textInput.length;

	// 1. Calculate Grid Resolution based on typing length
	// Minimum base grid: ~6x4. Maxes out around ~45x30 when full
	const baseCols = Math.min(6 + Math.floor(len * 1.5), 45);
	const screenRatio = viewportWidth / (viewportHeight || 1);

	// Keep rows proportional to screen aspect ratio
	let rows = Math.max(3, Math.round(baseCols / screenRatio));
	let cols = baseCols;

	// Enforce odd column count to guarantee a clean center symmetry axis
	if (cols % 2 === 0) cols += 1;

	// 2. Derive PRNG from input text (or current timestamp fallback)
	const BRAND_COLORS = ["var(--green)", "var(--blue)", "var(--yellow)", "var(--red)"];

	// Inside generateDynamicSeal function...
	const seedString = len > 0 ? textInput : fallbackSeed;
	const seed = fnv1a(seedString);
	const rng = mulberry32(seed);

	// 3. Build horizontally mirrored boolean matrix
	const halfWidth = Math.ceil(cols / 2);
	const grid: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < halfWidth; c++) {
			const isFilled = rng() > 0.52; // Density control (~48% active)
			grid[r][c] = isFilled;
			grid[r][cols - 1 - c] = isFilled; // Horizontal Mirror
		}
	}

	const color = BRAND_COLORS[seed % BRAND_COLORS.length];

	return { grid, color, rows, cols };
}
