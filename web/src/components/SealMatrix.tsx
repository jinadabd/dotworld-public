import type { TrinketSeal } from "../utils/genereateTrinketCover";
import styles from "./SealMatrix.module.css";

interface SealMatrixProps {
	seal: TrinketSeal;
	className?: string;
}

export function SealMatrix({ seal, className = "" }: SealMatrixProps) {
	const size = seal.grid.length;

	return (
		<div
			className={`${styles.matrixGrid} ${className}`}
			style={
				{
					"--matrix-size": size,
					"--dot-color": seal.color,
				} as React.CSSProperties
			}>
			{seal.grid.map((row, rIdx) =>
				row.map((active, cIdx) => (
					<span
						key={`${rIdx}-${cIdx}`}
						className={`${styles.dot} ${active ? styles.activeDot : ""}`}
					/>
				)),
			)}
		</div>
	);
}
