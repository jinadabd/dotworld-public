import { useMemo } from "react";
import { UserSealIcon } from "./icons";
import { generateUserSeal } from "../../utils/generateSeal";
import { KeyboardLayout, type KeyPosition } from "./KeyboardLayout";
import type { KeycapVariant } from "./Keycap";

interface Props {
	seed: string;
	colour?: KeycapVariant;
	isActive?: boolean;
	onClick?: () => void;
}

export function SealKeycap({ seed, colour = "yellow", isActive = false, onClick }: Props) {
	const seal = useMemo(() => {
		return generateUserSeal(seed);
	}, [seed]);

	const keys: KeyPosition[] = [
		{
			id: `seal-key-${seed}`,
			col: 1,
			row: 1,
			colSpan: 1,
			keycapProps: {
				colour,
				isActive,
				onRelease: onClick,
				children: <UserSealIcon seal={seal} />,
			},
		},
	];

	return (
		<KeyboardLayout
			keys={keys}
			columns={1}
			rows={1}
			plateColor="#272727"
		/>
	);
}
