import type { UserSeal } from "../../../utils/generateSeal";

export function UserSealIcon({ seal, size = 18 }: { seal: UserSeal; size?: number }) {
	// 1. Collect grid coordinates for active dots
	const activeCoords: { x: number; y: number }[] = [];
	seal.grid.forEach((row, y) => {
		row.forEach((isActive, x) => {
			if (isActive) activeCoords.push({ x, y });
		});
	});

	// Fallback if matrix is completely empty
	if (activeCoords.length === 0) {
		return (
			<svg
				width={size}
				height={size}
				viewBox="0 0 149.9 149.9"
				aria-hidden="true"
			/>
		);
	}

	// 2. Find min/max bounds of the active shape
	const minX = Math.min(...activeCoords.map((c) => c.x));
	const maxX = Math.max(...activeCoords.map((c) => c.x));
	const minY = Math.min(...activeCoords.map((c) => c.y));
	const maxY = Math.max(...activeCoords.map((c) => c.y));

	// 3. Compute tight viewBox dimensions around active dots
	const Step = 29.97;
	const Radius = 14.99;

	const vx = minX * Step;
	const vy = minY * Step;
	const vw = (maxX - minX + 1) * Step;
	const vh = (maxY - minY + 1) * Step;

	// Use square dimension so aspect ratio isn't distorted
	const vSize = Math.max(vw, vh);
	const offsetX = vx - (vSize - vw) / 2;
	const offsetY = vy - (vSize - vh) / 2;

	return (
		<svg
			width={size}
			height={size}
			viewBox={`${offsetX.toFixed(2)} ${offsetY.toFixed(2)} ${vSize.toFixed(2)} ${vSize.toFixed(2)}`}
			fill="currentColor"
			aria-hidden="true">
			<g>
				{activeCoords.map(({ x, y }) => (
					<circle
						key={`${x}-${y}`}
						className="cls-1"
						cx={Number((x * Step + Radius).toFixed(2))}
						cy={Number((y * Step + Radius).toFixed(2))}
						r={Radius}
					/>
				))}
			</g>
		</svg>
	);
}
