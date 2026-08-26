import { useState, useEffect, useMemo, useRef } from "react";
import { useViewportGrid } from "../../hooks/useViewportGrid";
import { Keycap } from "../../components/buttons/Keycap";
import { UserSealIcon } from "../../components/buttons/icons";
import { generateUserSeal } from "../../utils/generateSeal";
import styles from "./LandingGrid.module.css";
import { LandingButtons } from "./LearnMoreButton";

// Deterministic pseudo-random color based on cell coordinates
function getDeterministicColour(r: number, c: number): "yellow" | "green" | "blue" | "red" {
	const hash = (r * 37 + c * 17) % 100;
	if (hash < 30) return "yellow";
	if (hash < 50) return "green";
	if (hash < 80) return "blue";
	return "red";
}

const KEYCAP_SIZE = 60;
const GAP_SIZE = 8;
const STEP = KEYCAP_SIZE + GAP_SIZE;

interface GridCellData {
	key: string;
	row: number;
	col: number;
	colour: "yellow" | "green" | "blue" | "red";
	seal: ReturnType<typeof generateUserSeal>;
}

export function LandingGrid() {
	const { cols, rows, centerBox } = useViewportGrid();
	const [activeKeys, setActiveKeys] = useState<Record<string, boolean>>({});
	const [scale, setScale] = useState(1);
	const containerRef = useRef<HTMLDivElement>(null);

	// Grid cell calculation using stable seeds
	const gridCells = useMemo(() => {
		if (!cols || !rows) return [];
		const cells: GridCellData[] = [];

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				const isCenter =
					c >= centerBox.colStart - 1 &&
					c < centerBox.colEnd - 1 &&
					r >= centerBox.rowStart - 1 &&
					r < centerBox.rowEnd - 1;

				if (!isCenter) {
					const seed = `cell_${r}_${c}`;
					cells.push({
						key: `${r}-${c}`,
						row: r,
						col: c,
						colour: getDeterministicColour(r, c),
						seal: generateUserSeal(seed),
					});
				}
			}
		}
		return cells;
	}, [cols, rows, centerBox.colStart, centerBox.colEnd, centerBox.rowStart, centerBox.rowEnd]);

	const containerWidth = cols ? cols * STEP - GAP_SIZE : 0;
	const containerHeight = rows ? rows * STEP - GAP_SIZE : 0;

	// Scaling calculation
	useEffect(() => {
		function updateScale() {
			if (!containerWidth || !containerHeight) return;

			const marginInPixels = 32;
			const targetWidth = window.innerWidth - marginInPixels;
			const targetHeight = window.innerHeight - marginInPixels;

			const scaleX = targetWidth / containerWidth;
			const scaleY = targetHeight / containerHeight;

			setScale(Math.min(scaleX, scaleY));
		}

		updateScale();
		window.addEventListener("resize", updateScale);
		return () => window.removeEventListener("resize", updateScale);
	}, [containerWidth, containerHeight]);

	// Random pulse animation interval
	useEffect(() => {
		if (gridCells.length === 0) return;

		const interval = setInterval(() => {
			const countToActivate = Math.floor(Math.random() * 3) + 2;
			const keysToActivate: string[] = [];

			for (let i = 0; i < countToActivate; i++) {
				const randomCell = gridCells[Math.floor(Math.random() * gridCells.length)];
				if (randomCell) {
					keysToActivate.push(randomCell.key);
				}
			}

			setActiveKeys((prev) => {
				const next = { ...prev };
				keysToActivate.forEach((k) => (next[k] = true));
				return next;
			});

			setTimeout(() => {
				setActiveKeys((prev) => {
					const next = { ...prev };
					keysToActivate.forEach((k) => delete next[k]);
					return next;
				});
			}, 1300);
		}, 700);

		return () => clearInterval(interval);
	}, [gridCells]);

	if (!cols || !rows) return null;

	const centerColSpan = centerBox.colEnd - centerBox.colStart;
	const centerRowSpan = centerBox.rowEnd - centerBox.rowStart;

	const centerWidth = centerColSpan * STEP - GAP_SIZE;
	const centerHeight = centerRowSpan * STEP - GAP_SIZE;

	const centerLeft = (centerBox.colStart - 1) * STEP;
	const centerTop = (centerBox.rowStart - 1) * STEP;

	return (
		<div className={styles.viewportWrapper}>
			<div
				ref={containerRef}
				className={styles.canvasContainer}
				style={{
					width: `${containerWidth}px`,
					height: `${containerHeight}px`,
					transform: `scale(${scale})`,
				}}>
				{gridCells.map((cell) => (
					<div
						key={cell.key}
						className={styles.absoluteKeycapSlot}
						style={{
							left: `${cell.col * STEP}px`,
							top: `${cell.row * STEP}px`,
						}}>
						<Keycap
							colour={cell.colour}
							isActive={!!activeKeys[cell.key]}>
							<UserSealIcon seal={cell.seal} />
						</Keycap>
					</div>
				))}

				<div
					className={styles.centerCard}
					style={{
						left: `${centerLeft}px`,
						top: `${centerTop}px`,
						width: `${centerWidth}px`,
						height: `${centerHeight}px`,
						zIndex: 10,
					}}>
					<h1 className={styles.brandTitle}>dotworld</h1>
					<div className={styles.buttonGroup}>
						<LandingButtons />
					</div>
				</div>
			</div>
		</div>
	);
}
