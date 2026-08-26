import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { type Colours } from "./TactileButton";
import { KeyboardLayout, type KeyPosition } from "./KeyboardLayout";
import { LockIcon } from "./icons";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	colour?: Colours;
	icon?: ReactNode;
	onRelease?: () => void;
	resetTrigger?: unknown;
	isMini?: boolean;
}

export function TactileButtonWithConfirm({
	colour = "cream",
	icon,
	children,
	onRelease,
	resetTrigger,
	isMini = false,
	...rest
}: Props) {
	const [unlocked, setUnlocked] = useState(false);

	useEffect(() => {
		setUnlocked(false);
	}, [resetTrigger]);

	const buttonKeys: KeyPosition[] = [
		{
			id: `${rest.id}unlockButton`,
			col: 1,
			row: 1,
			colSpan: 1,
			keycapProps: {
				disabled: unlocked,
				onRelease: () => setUnlocked(true),
				children: <LockIcon />,
			},
		},
		{
			id: `${rest.id}tactileButton`,
			col: 2,
			row: 1,
			colSpan: isMini ? 1 : 2,
			keycapProps: {
				colour: colour,
				legend: "⬤",
				disabled: !unlocked,
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
			keys={buttonKeys}
			columns={2}
			rows={1}
			plateColor="#272727"
		/>
	);
}
