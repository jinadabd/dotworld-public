import { useState, useEffect } from "react";

const KEYCAP_SIZE = 60;
const GAP_SIZE = 8;
const SAFE_MARGIN = 32; // Exactly 1rem (16px) per side

interface GridConfig {
	cols: number;
	rows: number;
	centerBox: {
		colStart: number;
		colEnd: number;
		rowStart: number;
		rowEnd: number;
	};
}

export function useViewportGrid(): GridConfig {
	const [config, setConfig] = useState<GridConfig>({
		cols: 0,
		rows: 0,
		centerBox: { colStart: 0, colEnd: 0, rowStart: 0, rowEnd: 0 },
	});

	useEffect(() => {
		function calculateGrid() {
			const availableWidth = window.innerWidth - SAFE_MARGIN;
			const availableHeight = window.innerHeight - SAFE_MARGIN;

			const step = KEYCAP_SIZE + GAP_SIZE;

			// Calculate absolute max rows & cols that fit without subtracting arbitrary offsets
			const cols = Math.max(7, Math.floor((availableWidth + GAP_SIZE) / step));
			const rows = Math.max(7, Math.floor((availableHeight + GAP_SIZE) / step));

			// Determine overlay dimensions (encompassing center nicely)
			const baseColSpan = cols >= 13 ? 7 : 5;
			const baseRowSpan = rows >= 9 ? 4 : 3;

			// Compute true mathematical center for odd/even row counts
			const colStart = Math.floor((cols - baseColSpan) / 2) + 1;
			const colEnd = colStart + baseColSpan;

			const rowStart = Math.floor((rows - baseRowSpan) / 2) + 1;
			const rowEnd = rowStart + baseRowSpan;

			setConfig({
				cols,
				rows,
				centerBox: { colStart, colEnd, rowStart, rowEnd },
			});
		}

		calculateGrid();
		window.addEventListener("resize", calculateGrid);
		return () => window.removeEventListener("resize", calculateGrid);
	}, []);

	return config;
}
