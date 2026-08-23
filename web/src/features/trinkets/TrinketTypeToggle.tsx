import type { TrinketType } from "@shared/types";
import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";

interface Props {
	type: TrinketType;
	setType: React.Dispatch<React.SetStateAction<TrinketType>>;
}

export function TrinketTypeToggle({ type, setType }: Props) {
	const keys: KeyPosition[] = [
		{
			id: "collectionButton",
			col: 1,
			row: 1,
			colSpan: 2,
			keycapProps: {
				className: `${"green"}`.trim(),
				colour: "green",
				type: "button",
				isActive: type === "collection",
				onPress: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setType("collection");
				},
				onRelease: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setType("collection");
				},
				children: <div>Collection</div>,
			},
		},
		{
			id: "playlistButton",
			col: 3,
			row: 1,
			colSpan: 2,
			keycapProps: {
				className: `${"green"}`.trim(),
				colour: "green",
				type: "button",
				isActive: type === "playlist",
				onPress: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setType("playlist");
				},
				onRelease: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setType("playlist");
				},
				children: <div>Playlist</div>,
			},
		},
		{
			id: "galleryButton",
			col: 5,
			row: 1,
			colSpan: 2,
			keycapProps: {
				className: `${"green"}`.trim(),
				colour: "green",
				type: "button",
				isActive: type === "gallery",
				onPress: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setType("gallery");
				},
				onRelease: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setType("gallery");
				},
				children: <div>Gallery</div>,
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
