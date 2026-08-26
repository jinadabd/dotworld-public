import type { TrinketSeal } from "../../../utils/genereateTrinketCover";

export function TrinketCoverIcon({
	seal,
	size,
	className,
}: {
	seal: TrinketSeal;
	size?: number;
	className?: string;
}) {
	const svgWidth = size ?? (className ? undefined : 18);
	const svgHeight = size ?? (className ? undefined : 18);

	const activeCoords: { x: number; y: number }[] = [];
	seal.grid.forEach((row, y) => {
		row.forEach((isActive, x) => {
			if (isActive) activeCoords.push({ x, y });
		});
	});

	if (activeCoords.length === 0) {
		return (
			<svg
				width={svgWidth}
				height={svgHeight}
				viewBox="0 0 389.61 389.61"
				aria-hidden="true"
				className={className}
			/>
		);
	}

	const minX = Math.min(...activeCoords.map((c) => c.x));
	const maxX = Math.max(...activeCoords.map((c) => c.x));
	const minY = Math.min(...activeCoords.map((c) => c.y));
	const maxY = Math.max(...activeCoords.map((c) => c.y));

	const Step = 29.97;
	const Radius = 12.5;

	const vx = minX * Step;
	const vy = minY * Step;
	const vw = (maxX - minX + 1) * Step;
	const vh = (maxY - minY + 1) * Step;

	const vSize = Math.max(vw, vh);
	const offsetX = vx - (vSize - vw) / 2;
	const offsetY = vy - (vSize - vh) / 2;

	const renderCircles = (rOffset = 0) =>
		activeCoords.map(({ x, y }) => (
			<circle
				key={`${x}-${y}`}
				cx={Number((x * Step + 14.99).toFixed(2))}
				cy={Number((y * Step + 14.99).toFixed(2))}
				r={Radius + rOffset}
			/>
		));

	return (
		<svg
			width={svgWidth}
			height={svgHeight}
			viewBox={`${offsetX.toFixed(2)} ${offsetY.toFixed(2)} ${vSize.toFixed(2)} ${vSize.toFixed(2)}`}
			aria-hidden="true"
			className={className}>
			<defs>
				{/* Soft Gaussian Blur for the Bottom Lip Highlight */}
				<filter
					id="trinket-highlight-blur"
					x="-20%"
					y="-20%"
					width="140%"
					height="140%">
					<feGaussianBlur stdDeviation="0.6" />
				</filter>

				{/* Deep Top-Down Inner Shadow Filter */}
				<filter
					id="top-inner-shadow"
					x="-50%"
					y="-50%"
					width="200%"
					height="200%">
					<feOffset
						dx="0"
						dy="5"
					/>
					<feGaussianBlur
						stdDeviation="0.5"
						result="blur"
					/>
					<feComposite
						operator="out"
						in="SourceGraphic"
						in2="blur"
						result="inverse"
					/>
					<feFlood
						floodColor="var(--dark, #121212)"
						floodOpacity="0.85"
						result="color"
					/>
					<feComposite
						operator="in"
						in="color"
						in2="inverse"
						result="shadow"
					/>
					<feComposite
						operator="over"
						in="shadow"
						in2="SourceGraphic"
					/>
				</filter>

				{/* Strict clipping mask for dot interiors */}
				<mask id="dots-mask">
					<rect
						x="-100%"
						y="-100%"
						width="300%"
						height="300%"
						fill="black"
					/>
					<g fill="white">{renderCircles()}</g>
				</mask>
			</defs>

			{/* 1. Bottom Lip Bevel Highlight (Renders underneath sockets, catching the lower outer rim) */}
			<g
				fill="var(--white, #ffffff)"
				opacity="0.8"
				filter="url(#trinket-highlight-blur)"
				transform="translate(0, 1.8)">
				{renderCircles()}
			</g>

			{/* 2. Carved Socket Interior */}
			<g mask="url(#dots-mask)">
				{/* Base Cavity Floor Tone */}
				<g fill="var(--brown, #5c4033)">{renderCircles()}</g>

				{/* Top Deep Inner Drop Shadow */}
				<g
					fill="var(--brown, #5c4033)"
					filter="url(#top-inner-shadow)">
					{renderCircles()}
				</g>
			</g>
		</svg>
	);
}
