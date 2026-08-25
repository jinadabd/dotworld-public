import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";
import friendStyles from "./Friends.module.css";

interface Props {
	isSearching: boolean;
	onToggleSearch: () => void;
	onSubmit: () => void;
	hasContent: boolean;
	isBusy: boolean;
}

export function SearchToolbar({
	isSearching,
	onToggleSearch,
	onSubmit,
	hasContent,
	isBusy,
}: Props) {
	const keys: KeyPosition[] = [
		...(isSearching
			? [
					{
						id: "searchKey",
						col: 1,
						row: 1,
						colSpan: 2,
						keycapProps: {
							colour: "red" as const,
							disabled: !hasContent || isBusy,
							onRelease: onSubmit,
							children: isBusy ? "Searching..." : "Search",
						},
					},
				]
			: []),
		{
			id: "toggleSearchKey",
			col: isSearching ? 3 : 1,
			row: 1,
			colSpan: 1,
			keycapProps: {
				type: "button" as const,
				colour: "cream" as const,
				onRelease: () => onToggleSearch(),
				children: (
					<span
						className={friendStyles.toggleIcon}
						data-active={isSearching}>
						+
					</span>
				),
			},
		},
	];

	return (
		<div className={friendStyles.toolbarWrapper}>
			<KeyboardLayout
				keys={keys}
				columns={isSearching ? 3 : 1}
				rows={1}
				plateColor="#272727"
			/>
		</div>
	);
}
