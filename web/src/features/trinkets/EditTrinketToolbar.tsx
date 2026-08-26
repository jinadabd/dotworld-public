import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";
import styles from "./Trinkets.module.css";

interface Props {
	isEditing: boolean;
	onToggleEdit: () => void;
	onSave: () => void;
	isBusy: boolean;
	isEmpty?: boolean;
	hasBeenEdited?: boolean;
	isMini?: boolean;
}

export function EditTrinketToolbar({
	isEditing,
	onToggleEdit,
	onSave,
	isBusy,
	isEmpty = false,
	hasBeenEdited = false,
	isMini = false,
}: Props) {
	const keys: KeyPosition[] = [
		{
			id: "toggleEditKey",
			col: 1,
			row: 1,
			colSpan: 1,
			keycapProps: {
				type: "button" as const,
				colour: "cream" as const,
				disabled: isBusy,
				onRelease: onToggleEdit,
				children: isEditing ? (isMini ? "X" : "Cancel") : "Edit",
			},
		},
		...(isEditing
			? [
					{
						id: "saveKey",
						col: 1,
						row: 2,
						colSpan: 1,
						keycapProps: {
							colour: "green" as const,
							disabled: isBusy || isEmpty || !hasBeenEdited,
							onRelease: onSave,
							children: isBusy
								? isMini
									? "..."
									: "Saving..."
								: isMini
									? "S"
									: "Save",
						},
					},
				]
			: []),
	];

	return (
		<div
			className={styles.toolbarWrapper}
			data-mode="column">
			<KeyboardLayout
				keys={keys}
				columns={1}
				rows={isEditing ? 2 : 1}
				plateColor="#272727"
			/>
		</div>
	);
}
