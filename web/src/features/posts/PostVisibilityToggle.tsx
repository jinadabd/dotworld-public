import type { PostVisibility } from "@shared/types";
import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";

interface Props {
	visibility: PostVisibility;
	setVisibility: React.Dispatch<React.SetStateAction<PostVisibility>>;
}

export function PostVisibilityToggle({ visibility, setVisibility }: Props) {
	const keys: KeyPosition[] = [
		{
			id: "selfButton",
			col: 1,
			row: 1,
			colSpan: 2,
			keycapProps: {
				className: `${"red"}`.trim(),
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
				children: "Self",
			},
		},
		{
			id: "friendsButton",
			col: 3,
			row: 1,
			colSpan: 2,
			keycapProps: {
				className: `${"green"}`.trim(),
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
