import type { KeycapVariant, KeycapSize } from "./Keycap.types";

const SIZE_RATIOS: Record<KeycapSize, number> = {
	"1u": 1,
	"1.25u": 1.25,
	"1.5u": 1.5,
	"2u": 2,
	"2u-v": 0.5,
	"3u": 3,
};

/* ============================
 * STOP POSITIONS (degrees) — unchanged from the original repo.
 * This is the geometry that creates the 3D bevel illusion; only the
 * COLORS at each stop change per variant, never these angles.
 * ============================ */

const STOPS_1U = [0, 5.4, 84.6, 95.4, 174.6, 185.4, 264.6, 275.4, 354.6, 360];
const STOPS_2U_LEFT = [0, 5.4, 84.6, 95.4, 197.5, 202.5, 255, 354.6, 360];
const STOPS_2U_RIGHT = [0, 22, 45, 174.6, 185.4, 264.6, 275.4, 430];

/* ============================
 * COLOR STOPS PER VARIANT
 *
 * Cream keeps its original hand-tuned hex stops verbatim — untouched.
 * Charcoal is restored from the repo author's own commented-out stops —
 * a fixed dark neutral, not tied to any accent color, since it's meant
 * for dark mode chrome rather than a "colour" choice.
 *
 * Yellow/green/blue/red are generated at runtime via color-mix() against
 * each project CSS variable, using ratios that reproduce the SAME relative
 * light/dark pattern as the cream stops (index 2 = brightest/highlight,
 * index 8 = darkest, etc). This is what actually lets the bezel react to
 * the `colour` prop instead of always rendering cream underneath.
 * ============================ */

type StopArray = [string, string, string, string, string, string, string, string, string, string];

const CREAM_STOPS: StopArray = [
	"#b0a898",
	"#e0dbd0",
	"#f2ede4",
	"#ddd8cc",
	"#e0dbd0",
	"#a49e90",
	"#a09a8c",
	"#908a7c",
	"#8e8878",
	"#b0a898",
];

const CHARCOAL_STOPS: StopArray = [
	"#3a3a40",
	"#4a4a50",
	"#5c5c62",
	"#484a4e",
	"#4a4a4e",
	"#34343a",
	"#333538",
	"#2a2a2e",
	"#2a2a30",
	"#3a3a40",
];

// Relative mix ratios reproducing cream's own light/dark curve across
// the 10 stops. Applied against any base CSS color via color-mix().
const MIX_RATIOS: Array<{ pct: number; toward: "white" | "black" }> = [
	{ pct: 75, toward: "black" }, // 0 — darker corner
	{ pct: 92, toward: "white" }, // 1
	{ pct: 80, toward: "white" }, // 2 — brightest, top highlight
	{ pct: 90, toward: "black" }, // 3
	{ pct: 92, toward: "white" }, // 4 — mirrors index 1
	{ pct: 68, toward: "black" }, // 5
	{ pct: 64, toward: "black" }, // 6
	{ pct: 56, toward: "black" }, // 7
	{ pct: 54, toward: "black" }, // 8 — darkest
	{ pct: 75, toward: "black" }, // 9 — mirrors index 0
];

function buildDerivedStops(cssVar: string): StopArray {
	return MIX_RATIOS.map(
		({ pct, toward }) => `color-mix(in oklch, ${cssVar} ${pct}%, ${toward})`,
	) as StopArray;
}

const VARIANT_STOPS: Record<Exclude<KeycapVariant, "custom">, StopArray> = {
	cream: CREAM_STOPS,
	charcoal: CHARCOAL_STOPS,
	yellow: buildDerivedStops("var(--yellow)"),
	green: buildDerivedStops("var(--green)"),
	blue: buildDerivedStops("var(--blue)"),
	red: buildDerivedStops("var(--red)"),
};

// Neutral mid-tones used to stitch wide (2u+/3u) keys' middle section —
// previously hardcoded to cream-specific hex regardless of variant, which
// leaked cream into colored wide keys the same way the bezel bug did.
// Now derived per-variant from the same stop set, indices 1 and 8.
function neutralStops(stops: StopArray): { mid: string; dark: string } {
	return { mid: stops[1], dark: stops[8] };
}

function buildConic(colors: string[], positions: number[]): string {
	const stops = colors.map((color, i) => `${color} ${positions[i].toFixed(1)}deg`).join(", ");
	return `conic-gradient(from 225deg, ${stops})`;
}

function buildStitchedGradient(stops: StopArray): string {
	const { mid, dark } = neutralStops(stops);

	const leftColors = [stops[0], stops[1], stops[2], mid, mid, stops[5], dark, stops[8], stops[9]];
	const rightColors = [dark, dark, mid, mid, stops[5], stops[6], dark, dark];

	const leftConic = buildConic(leftColors, STOPS_2U_LEFT);
	const rightConic = buildConic(rightColors, STOPS_2U_RIGHT);

	return [
		`${leftConic} 0 0 / 50% 100% no-repeat`,
		`${rightConic} 100% 0 / 50% 100% no-repeat`,
	].join(", ");
}

export function buildSideGradient(variant: KeycapVariant, size: KeycapSize): string | undefined {
	if (variant === "custom") return undefined;

	const stops = VARIANT_STOPS[variant];
	const ratio = SIZE_RATIOS[size];

	if (ratio >= 2 || ratio <= 0.5) {
		return buildStitchedGradient(stops);
	}

	return buildConic(stops, STOPS_1U);
}
