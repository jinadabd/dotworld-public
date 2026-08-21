import type { ButtonHTMLAttributes, ReactNode } from "react";
// import styles from "./TactileButton.module.css";
import { KeyboardLayout, type KeyPosition } from "./KeyboardLayout";

export type Colours = "yellow" | "green" | "blue" | "red" | "cream" | "charcoal";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	colour?: Colours;
	icon?: ReactNode;
	active?: boolean;
	disabled?: boolean;
	onRelease?: () => void;
}

export function TactileButton({
	colour = "cream",
	icon,
	children,
	className,
	active,
	onRelease,
	disabled,
	...rest
}: Props) {
	const buttonKey: KeyPosition[] = [
		{
			id: `${rest.id}${colour}`,
			col: 1,
			row: 1,
			colSpan: 2,
			keycapProps: {
				// className:
				// 	`${styles.tactile} ${styles[colour]} ${active ? "active" : ""} ${disabled ? "disabled" : ""} ${className ?? ""}`.trim(),
				colour: colour,
				legend: "⬤",
				isActive: active,
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
