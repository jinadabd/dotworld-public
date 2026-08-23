import type { TrinketType } from "@shared/types";
import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";
import widgetStyles from "./Widgets.module.css";

interface Props {
	filter: TrinketType | "all";
	setFilter: React.Dispatch<React.SetStateAction<TrinketType | "all">>;
}

export function FilterTrinketsWidget({ filter, setFilter }: Props) {
	const keys: KeyPosition[] = [
		{
			id: "allButton",
			col: 1,
			row: 1,
			colSpan: 2,
			keycapProps: {
				className: `${"green"}`.trim(),
				colour: "green",
				type: "button",
				isActive: filter === "all",
				onPress: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setFilter("all");
				},
				onRelease: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setFilter("all");
				},
				children: <div>All</div>,
			},
		},
		{
			id: "collectionButton",
			col: 1,
			row: 2,
			colSpan: 2,
			keycapProps: {
				className: `${"green"}`.trim(),
				colour: "green",
				type: "button",
				isActive: filter === "collection",
				onPress: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setFilter("collection");
				},
				onRelease: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setFilter("collection");
				},
				children: <div>Collections</div>,
			},
		},
		{
			id: "playlistButton",
			col: 1,
			row: 3,
			colSpan: 2,
			keycapProps: {
				className: `${"green"}`.trim(),
				colour: "green",
				type: "button",
				isActive: filter === "playlist",
				onPress: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setFilter("playlist");
				},
				onRelease: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setFilter("playlist");
				},
				children: <div>Playlists</div>,
			},
		},
		{
			id: "galleryButton",
			col: 1,
			row: 4,
			colSpan: 2,
			keycapProps: {
				className: `${"green"}`.trim(),
				colour: "green",
				type: "button",
				isActive: filter === "gallery",
				onPress: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setFilter("gallery");
				},
				onRelease: (e?: React.MouseEvent) => {
					e?.preventDefault();
					setFilter("gallery");
				},
				children: <div>Galleries</div>,
			},
		},
	];

	return (
		<div className={widgetStyles.widget}>
			<h3 className={widgetStyles.widgetTitle}>Filter</h3>
			<KeyboardLayout
				keys={keys}
				columns={1}
				rows={4}
				plateColor="#272727"
			/>
		</div>
	);
}
