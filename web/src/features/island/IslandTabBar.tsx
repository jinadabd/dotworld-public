import type { ButtonHTMLAttributes } from "react";
import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	activeTab: string;
	setActiveTab: React.Dispatch<React.SetStateAction<"posts" | "trinkets">>;
}

export function IslandTabBar({ activeTab, setActiveTab }: Props) {
	const keys: KeyPosition[] = [
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
			keys={keys}
			columns={4}
			rows={1}
			plateColor="#272727"
		/>
	);
}
