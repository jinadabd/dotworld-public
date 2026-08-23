import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";
import trinketStyles from "./Trinkets.module.css";

interface Props {
	isCreating: boolean;
	onToggleCreate: () => void;
	onSubmit: () => void;
	hasTitle: boolean;
	isBusy: boolean;
}

export function CreateTrinketToolbar({
	isCreating,
	onToggleCreate,
	onSubmit,
	hasTitle,
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
							disabled: !hasTitle || isBusy,
							onRelease: onSubmit,
							children: isBusy ? "Creating..." : "Create",
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
