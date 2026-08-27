import { useEffect, useState } from "react";
import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";
import postStyles from "./Widgets.module.css";

interface Props {
	isEditing: boolean;
	onToggleEdit: () => void;
	onSave: () => void;
	isBusy: boolean;
	isEmpty?: boolean;
	hasBeenEdited?: boolean;
	isMini?: boolean;
}

export function EditTrinketWidget({
	isEditing,
	onToggleEdit,
	onSave,
	isBusy,
	isEmpty,
	hasBeenEdited,
	isMini = false,
}: Props) {
	const [isMobile, setIsMobile] = useState(() =>
		typeof window !== "undefined" ? window.innerWidth <= 640 : false,
	);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 640);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Desktop = Column layout | Mobile = Row layout
	const isColumn = !isMobile;

	const keys: KeyPosition[] = [
		{
			id: "toggleEditKey",
			col: 1,
			row: 1, // Edit/Cancel always stays on Row 1
			colSpan: isMini ? 1 : 2,
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
						col: isColumn ? 1 : 2,
						row: isColumn ? 2 : 1, // Save is below on desktop, beside on mobile
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
	];

	const columns = isEditing && !isColumn ? 2 : 1;
	const rows = isEditing && isColumn ? 2 : 1;

	return (
		<div
			className={postStyles.toolbarWrapper}
			data-mode={isColumn ? "column" : "row"}>
			<KeyboardLayout
				keys={keys}
				columns={columns}
				rows={rows}
				plateColor="#272727"
			/>
		</div>
	);
}
