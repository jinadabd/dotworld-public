import { useState, useEffect, useMemo, useRef } from "react";
import { useViewportGrid } from "../../hooks/useViewportGrid";
import { Keycap } from "../../components/buttons/Keycap";
import { UserSealIcon } from "../../components/buttons/icons";
import { generateUserSeal } from "../../utils/generateSeal";
import styles from "./LandingGrid.module.css";
import { LandingButtons } from "./LearnMoreButton";

function getWeightedRandomColour() {
	const rand = Math.random();
	if (rand < 0.3) return "yellow";
	if (rand < 0.5) return "green";
	if (rand < 0.8) return "blue";
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

	// Matrix grid cells calculation using exact bounds
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
					const seed = `cell_${r}_${c}_${Math.random()}`;
					cells.push({
						key: `${r}-${c}`,
						row: r,
						col: c,
						colour: getWeightedRandomColour(),
						seal: generateUserSeal(seed),
					});
				}
			}
		}
		return cells;
	}, [cols, rows, centerBox]);

	const containerWidth = cols * STEP - GAP_SIZE;
	const containerHeight = rows * STEP - GAP_SIZE;

	// Scale precisely so the grid edge hits the 1rem margin without leaving dead space
	useEffect(() => {
		function updateScale() {
			if (!containerWidth || !containerHeight) return;

			const marginInPixels = 32; // 1rem padding per side
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

	// Random pulse interval
	useEffect(() => {
		if (gridCells.length === 0) return;

		const interval = setInterval(() => {
			const countToActivate = Math.floor(Math.random() * 3) + 2;
			const newActiveState: Record<string, boolean> = {};

			for (let i = 0; i < countToActivate; i++) {
				const randomCell = gridCells[Math.floor(Math.random() * gridCells.length)];
				if (randomCell) {
					newActiveState[randomCell.key] = true;
				}
			}

			setActiveKeys((prev) => ({ ...prev, ...newActiveState }));

			// Release the pressed keys after 400ms
			setTimeout(() => {
				setActiveKeys((prev) => {
					const next = { ...prev };
					Object.keys(newActiveState).forEach((k) => delete next[k]);
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
				{gridCells.map((cell) => {
					const isActive = !!activeKeys[cell.key];

					return (
						<div
							key={cell.key}
							className={styles.absoluteKeycapSlot}
							style={{
								left: `${cell.col * STEP}px`,
								top: `${cell.row * STEP}px`,
							}}>
							<Keycap
								colour={cell.colour}
								isActive={isActive}>
								<UserSealIcon seal={cell.seal} />
							</Keycap>
						</div>
					);
				})}

				<div
					className={styles.centerCard}
					style={{
						left: `${centerLeft}px`,
						top: `${centerTop}px`,
						width: `${centerWidth}px`,
						height: `${centerHeight}px`,
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
