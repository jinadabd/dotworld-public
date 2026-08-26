import type { IslandVisibility, TrinketVisibility } from "@shared/types";
import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";
import { FriendsIcon, IslandIcon } from "../../components/buttons/icons";

interface Props {
	visibility: IslandVisibility;
	setVisibility: React.Dispatch<React.SetStateAction<IslandVisibility>>;
}

export function IslandVisibilityToggle({ visibility, setVisibility }: Props) {
	const keys: KeyPosition[] = [
		{
			id: "friendsButton",
			col: 1,
			row: 1,
			colSpan: 2,
			keycapProps: {
				className: `${"blue"}`.trim(),
				colour: "blue",
				type: "button",
				isActive: visibility === "friends",
				onPress: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setVisibility("friends");
				},
				onRelease: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setVisibility("friends");
				},
				children: "Friends",
			},
		},
		{
			id: "worldButton",
			col: 3,
			row: 1,
			colSpan: 2,
			keycapProps: {
				className: `${"green"}`.trim(),
				colour: "green",
				type: "button",
				isActive: visibility === "world",
				onPress: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setVisibility("world");
				},
				onRelease: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setVisibility("world");
				},
				children: "World",
			},
		},
	];

	return (
		<KeyboardLayout
			keys={keys}
			columns={2}
			rows={1}
			plateColor="#272727"
		/>
	);
}
