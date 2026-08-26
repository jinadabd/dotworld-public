// import { useState, type ReactNode } from "react";
// import styles from "./Widgets.module.css";
// import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";
// import playlistCover from "../../assets/images/playlistCover.jpg";

export type Colours = "yellow" | "green" | "blue" | "red" | "cream" | "charcoal";

export function PlaylistWdiget() {
	return <div>Playlist</div>;
	// const [state, setState] = useState<"Pause" | "Play">("Play");
	// const [clicked, setClicked] = useState(false);

	// const buttonKey: KeyPosition[] = [
	// 	{
	// 		id: `rewindButton`,
	// 		col: 1,
	// 		row: 1,
	// 		keycapProps: {
	// 			colour: "cream",
	// 			children: (
	// 				<p
	// 					style={
	// 						{
	// 							fontFamily: "Bitcount",
	// 						} as React.CSSProperties
	// 					}>
	// 					{"<"}
	// 				</p>
	// 			),
	// 		},
	// 	},
	// 	{
	// 		id: `pauseResumeButton`,
	// 		col: 2,
	// 		row: 1,
	// 		colSpan: 2,
	// 		keycapProps: {
	// 			colour: "cream",
	// 			onPress: () => setClicked(!clicked),
	// 			children: (
	// 				<p
	// 					style={
	// 						{
	// 							fontFamily: "Bitcount",
	// 						} as React.CSSProperties
	// 					}>
	// 					{clicked ? "Pause" : "Play"}
	// 				</p>
	// 			),
	// 		},
	// 	},
	// 	{
	// 		id: `rewindButton`,
	// 		col: 4,
	// 		row: 1,
	// 		keycapProps: {
	// 			colour: "cream",
	// 			children: (
	// 				<p
	// 					style={
	// 						{
	// 							fontFamily: "Bitcount",
	// 						} as React.CSSProperties
	// 					}>
	// 					{">"}
	// 				</p>
	// 			),
	// 		},
	// 	},
	// ];

	// return (
	// 	<div className={styles.playlist}>
	// 		<img
	// 			src={playlistCover}
	// 			style={{
	// 				width: "15.8rem",
	// 				height: "15.8rem",
	// 				border: "4pt solid black",
	// 				borderRadius: "15px",
	// 			}}
	// 		/>
	// 		<KeyboardLayout
	// 			keys={buttonKey}
	// 			columns={3}
	// 			rows={1}
	// 			plateColor="#272727"
	// 		/>
	// 	</div>
	// );
}
