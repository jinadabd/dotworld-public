import type { ButtonHTMLAttributes, ReactNode } from "react";
// import styles from "./TactileButton.module.css";
import { KeyboardLayout, type KeyPosition } from "./KeyboardLayout";

export type Colours = "yellow" | "green" | "blue" | "red" | "cream" | "charcoal";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	colour?: Colours;
	icon?: ReactNode;
	active?: boolean;
	disabled?: boolean;
	isHighlighted?: boolean;
	onRelease?: () => void;
	isMini?: boolean;
	type?: "submit" | "reset" | "button";
}

export function TactileButton({
	colour = "cream",
	icon,
	children,
	className,
	active,
	onRelease,
	disabled,
	isHighlighted = false,
	isMini = false,
	type = "button",
	...rest
}: Props) {
	const buttonKey: KeyPosition[] = [
		{
			id: `${rest.id}${colour}`,
			col: 1,
			row: 1,
			colSpan: isMini ? 1 : 2,
			keycapProps: {
				type,
				colour: colour,
				legend: "⬤",
				isActive: active,
				isHighlighted,
				disabled,
				onRelease,
				children: (
					<>
						{icon}
						{children}
					</>
				),
			},
		},
	];

	return (
		<KeyboardLayout
			keys={buttonKey}
			columns={1}
			rows={1}
			plateColor="#272727"
		/>
	);
}
