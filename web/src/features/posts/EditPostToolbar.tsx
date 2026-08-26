import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";
import postStyles from "./Posts.module.css";

interface Props {
	isEditing: boolean;
	onToggleEdit: () => void;
	onSave: () => void;
	isBusy: boolean;
	isEmpty?: boolean;
	hasBeenEdited?: boolean;
	mode?: "row" | "column";
	isMini?: boolean;
}

export function EditPostToolbar({
	isEditing,
	onToggleEdit,
	onSave,
	isBusy,
	isEmpty,
	hasBeenEdited,
	mode = "row",
	isMini = false,
}: Props) {
	const isColumn = mode === "column";

	const keys: KeyPosition[] = [
		...(isEditing
			? [
					{
						id: "saveKey",
						col: 1,
						row: 1,
						colSpan: isMini ? 1 : 2,
						keycapProps: {
							colour: "red" as const,
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
		{
			id: "toggleEditKey",
			col: isEditing && !isColumn ? (isMini ? 2 : 3) : 1,
			row: isEditing && isColumn ? 2 : 1,
			colSpan: isMini ? 1 : 2,
			keycapProps: {
				type: "button" as const,
				colour: "cream" as const,
				disabled: isBusy,
				onRelease: onToggleEdit,
				children: isEditing ? (isMini ? "X" : "Cancel") : "Edit",
			},
		},
	];

	const columns = isEditing && !isColumn ? 2 : 1;
	const rows = isEditing && isColumn ? 2 : 1;

	return (
		<div
			className={postStyles.toolbarWrapper}
			data-mode={mode}>
			<KeyboardLayout
				keys={keys}
				columns={columns}
				rows={rows}
				plateColor="#272727"
			/>
		</div>
	);
}
