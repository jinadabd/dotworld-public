import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";
import postStyles from "./Posts.module.css";

interface Props {
	isComposing: boolean;
	onToggleCompose: () => void;
	onSubmit: () => void;
	hasContent: boolean;
	isBusy: boolean;
}

export function ComposeToolbar({
	isComposing,
	onToggleCompose,
	onSubmit,
	hasContent,
	isBusy,
}: Props) {
	const keys: KeyPosition[] = [
		...(isComposing
			? [
					{
						id: "postKey",
						col: 1,
						row: 1,
						colSpan: 2,
						keycapProps: {
							// form: "compose-post-form",
							colour: "red" as const,
							disabled: !hasContent || isBusy,
							onRelease: onSubmit,
							children: isBusy ? "Posting" : "Post",
						},
					},
				]
			: []),
		{
			id: "toggleKey",
			col: isComposing ? 3 : 1,
			row: 1,
			colSpan: 1,
			keycapProps: {
				type: "button" as const,
				colour: "cream" as const,
				onRelease: () => onToggleCompose(),
				children: (
					<span
						className={postStyles.toggleIcon}
						data-active={isComposing}>
						+
					</span>
				),
			},
		},
	];

	return (
		<div className={postStyles.toolbarWrapper}>
			<KeyboardLayout
				keys={keys}
				columns={isComposing ? 3 : 1}
				rows={1}
				plateColor="#272727"
			/>
		</div>
	);
}
