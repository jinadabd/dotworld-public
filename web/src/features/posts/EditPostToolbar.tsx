import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";
import postStyles from "./Posts.module.css";

interface Props {
	isEditing: boolean;
	onToggleEdit: () => void;
	onSave: () => void;
	isBusy: boolean;
	isEmpty?: boolean;
	hasBeenEdited?: boolean;
}

export function EditPostToolbar({
	isEditing,
	onToggleEdit,
	onSave,
	isBusy,
	isEmpty,
	hasBeenEdited,
}: Props) {
	const keys: KeyPosition[] = [
		...(isEditing
			? [
					{
						id: "saveKey",
						col: 1,
						row: 1,
						colSpan: 2,
						keycapProps: {
							colour: "red" as const,
							disabled: isBusy || isEmpty || !hasBeenEdited,
							onRelease: onSave,
							children: isBusy ? "..." : "Save",
						},
					},
				]
			: []),
		{
			id: "toggleEditKey",
			col: isEditing ? 3 : 1,
			row: 1,
			colSpan: 2,
			keycapProps: {
				type: "button" as const,
				colour: "cream" as const,
				disabled: isBusy,
				onRelease: onToggleEdit,
				children: isEditing ? "Cancel" : "Edit",
			},
		},
	];

	return (
		<div className={postStyles.toolbarWrapper}>
			<KeyboardLayout
				keys={keys}
				columns={isEditing ? 2 : 1}
				rows={1}
				plateColor="#272727"
			/>
		</div>
	);
}
