import type { TrinketVisibility } from "@shared/types";
import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";
import { FriendsIcon, IslandIcon } from "../../components/buttons/icons";

interface Props {
	visibility: TrinketVisibility;
	setVisibility: React.Dispatch<React.SetStateAction<TrinketVisibility>>;
}

export function TrinketVisibilityToggle({ visibility, setVisibility }: Props) {
	const keys: KeyPosition[] = [
		{
			id: "selfButton",
			col: 1,
			row: 1,
			keycapProps: {
				className: `${"yellow"}`.trim(),
				colour: "yellow",
				type: "button",
				isActive: visibility === "self",
				onPress: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setVisibility("self");
				},
				onRelease: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setVisibility("self");
				},
				children: <IslandIcon />,
			},
		},
		{
			id: "friendsButton",
			col: 2,
			row: 1,
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
				children: <FriendsIcon />,
			},
		},
		{
			id: "worldButton",
			col: 3,
			row: 1,
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
				children: "W",
			},
		},
	];

	return (
		<KeyboardLayout
			keys={keys}
			columns={3}
			rows={1}
			plateColor="#272727"
		/>
	);
}
