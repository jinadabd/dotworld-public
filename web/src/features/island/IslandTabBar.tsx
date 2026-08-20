import type { ButtonHTMLAttributes } from "react";
import type { RootState } from "../../app/store";
import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	activeTab: string;
	setActiveTab: React.Dispatch<React.SetStateAction<"posts" | "trinkets">>;
}

export function IslandTabBar({ activeTab, setActiveTab }: Props) {
	const navKeys: KeyPosition[] = [
		{
			id: "postsTab",
			col: 1,
			row: 1,
			colSpan: 2,
			keycapProps: {
				className: `${"red"}`.trim(),
				colour: "red",
				legend: "1",
				isActive: activeTab === "posts",
				onPress: () => setActiveTab("posts"),
				children: "Posts",
			},
		},
		{
			id: "trinketsTab",
			col: 3,
			row: 1,
			colSpan: 2,
			keycapProps: {
				className: `${"green"}`.trim(),
				colour: "green",
				legend: "2",
				isActive: activeTab === "trinkets",
				onPress: () => setActiveTab("trinkets"),
				children: "Trinkets",
			},
		},
	];

	return (
		<KeyboardLayout
			keys={navKeys}
			columns={4}
			rows={1}
			plateColor="#272727"
		/>
	);
}
