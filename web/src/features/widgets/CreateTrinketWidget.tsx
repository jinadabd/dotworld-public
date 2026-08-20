import type { TrinketType, TrinketVisibility } from "@shared/types";
import { TactileButton } from "../../components/buttons/TactileButton";
import { useCreateTrinket } from "../../hooks/useCreateTrinket";
import styles from "./Widgets.module.css";

export function CreateTrinketWidget() {
	const create = useCreateTrinket();

	// function handleKeyDown(e: React.KeyboardEvent) {
	// 	if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
	// 		e.preventDefault();
	// 		create.submit();
	// 	}
	// }

	return (
		<div className={`${styles.widget} ${styles.createTrinket}`}>
			<input
				className={styles.textInput}
				type="text"
				value={create.title}
				onChange={(e) => create.setTitle(e.target.value)}
				placeholder="Trinket title"
			/>
			<select
				className={styles.selectInput}
				value={create.visibility}
				onChange={(e) => create.setVisibility(e.target.value as TrinketVisibility)}>
				<option value="world">World</option>
				<option value="friends">Friends</option>
				<option value="self">Self</option>
			</select>

			<select
				className={styles.selectInput}
				value={create.type}
				onChange={(e) => create.setType(e.target.value as TrinketType)}>
				<option value="collection">Collection</option>
				<option value="playlist">Playlist</option>
				<option value="gallery">Gallery</option>
			</select>

			<TactileButton
				onClick={create.submit}
				disabled={!create.hasTitle || create.isBusy}>
				{create.isBusy ? "Creating..." : "Create"}
			</TactileButton>
		</div>
	);
}
