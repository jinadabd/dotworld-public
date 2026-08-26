import { KeyboardLayout, type KeyPosition } from "../../../components/buttons/KeyboardLayout";
import trinketStyles from "./Gallery.module.css";

interface Props {
	isCreating: boolean;
	onToggleCreate: () => void;
	onSubmit: () => void;
	hasContent: boolean;
	isBusy: boolean;
}

export function CreateTrinketItemToolbar({
	isCreating,
	onToggleCreate,
	onSubmit,
	hasContent,
	isBusy,
}: Props) {
	const keys: KeyPosition[] = [
		...(isCreating
			? [
					{
						id: "createKey",
						col: 1,
						row: 1,
						colSpan: 2,
						keycapProps: {
							colour: "green" as const,
							disabled: !hasContent || isBusy,
							onRelease: onSubmit,
							children: isBusy ? "Adding..." : "Add",
						},
					},
				]
			: []),
		{
			id: "toggleKey",
			col: isCreating ? 3 : 1,
			row: 1,
			colSpan: 1,
			keycapProps: {
				type: "button" as const,
				colour: "cream" as const,
				onRelease: () => onToggleCreate(),
				children: (
					<span
						className={trinketStyles.toggleIcon}
						data-active={isCreating}>
						+
					</span>
				),
			},
		},
	];

	return (
		<div className={trinketStyles.toolbarWrapper}>
			<KeyboardLayout
				keys={keys}
				columns={isCreating ? 3 : 1}
				rows={1}
				plateColor="#272727"
			/>
		</div>
	);
}
