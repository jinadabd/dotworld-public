import { useEffect, useState, useMemo, useId } from "react";
import { generateDynamicSeal } from "../../utils/generateDynamicSeal";

interface Props {
	inputText: string;
}

export function DynamicDotMatrix({ inputText }: Props) {
	const filterId = useId();
	const highlightFilterId = useId();

	const [dimensions, setDimensions] = useState({
		width: typeof window !== "undefined" ? window.innerWidth : 1000,
		height: typeof window !== "undefined" ? window.innerHeight : 800,
	});

	const initialSeed = useMemo(() => Date.now().toString(), []);

	useEffect(() => {
		function handleResize() {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const seal = useMemo(() => {
		return generateDynamicSeal(inputText, {
			inputLength: inputText.length,
			viewportWidth: dimensions.width,
			viewportHeight: dimensions.height,
			fallbackSeed: initialSeed,
		});
	}, [inputText, dimensions, initialSeed]);

	const cellWidth = dimensions.width / seal.cols;
	const cellHeight = dimensions.height / seal.rows;

	const maxRadius = Math.min(cellWidth, cellHeight) * 0.35;
	const dotRadius = Math.max(maxRadius, 1.5);

	const highlightOffset = Math.max(0.5, dotRadius * 0.15);
	const shadowOffset = Math.max(0.8, dotRadius * 0.25);
	const blurRadius = Math.max(0.3, dotRadius * 0.08);
	const highlightBlur = Math.max(0.2, dotRadius * 0.05);

	const renderDots = () =>
		seal.grid.map((row, r) =>
			row.map((active, c) => {
				if (!active) return null;
				const cx = c * cellWidth + cellWidth / 2;
				const cy = r * cellHeight + cellHeight / 2;

				return (
					<circle
						key={`${r}-${c}`}
						cx={cx}
						cy={cy}
						r={dotRadius}
					/>
				);
			}),
		);

	return (
		<svg
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				zIndex: -1,
				pointerEvents: "none",
				transition: "all 0.2s ease-out",
			}}
			width={dimensions.width}
			height={dimensions.height}>
			<defs>
				<filter
					id={highlightFilterId}
					x="-20%"
					y="-20%"
					width="140%"
					height="140%">
					<feGaussianBlur stdDeviation={highlightBlur} />
				</filter>

				<filter
					id={filterId}
					x="-50%"
					y="-50%"
					width="200%"
					height="200%">
					<feOffset
						dx="0"
						dy={shadowOffset}
					/>
					<feGaussianBlur
						stdDeviation={blurRadius}
						result="blur"
					/>
					<feComposite
						operator="out"
						in="SourceGraphic"
						in2="blur"
						result="inverse"
					/>
					<feFlood
						floodColor="var(--dark)"
						floodOpacity="0.95"
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
			</defs>

			<g
				fill="var(--white)"
				filter={`url(#${highlightFilterId})`}
				transform={`translate(0, ${highlightOffset})`}>
				{renderDots()}
			</g>

			<g fill={seal.color}>{renderDots()}</g>

			<g
				fill={seal.color}
				filter={`url(#${filterId})`}>
				{renderDots()}
			</g>
		</svg>
	);
}
