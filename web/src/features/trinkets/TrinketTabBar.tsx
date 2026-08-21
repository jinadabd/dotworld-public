import type { ButtonHTMLAttributes } from "react";
import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	activeTab: string;
	setActiveTab: React.Dispatch<React.SetStateAction<"self" | "friends" | "community">>;
}

export function TrinketTabBar({ activeTab, setActiveTab }: Props) {
	const navKeys: KeyPosition[] = [
		{
			id: "selfTab",
			col: 1,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "green",
				legend: "1",
				isActive: activeTab === "self",
				onPress: () => setActiveTab("self"),
				children: "Self",
			},
		},
		{
			id: "friendsTab",
			col: 3,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "green",
				legend: "2",
				isActive: activeTab === "friends",
				onPress: () => setActiveTab("friends"),
				children: "Friends",
			},
		},
		{
			id: "communityTab",
			col: 5,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "green",
				legend: "3",
				isActive: activeTab === "community",
				onPress: () => setActiveTab("community"),
				children: "Community",
			},
		},
	];

	return (
		<KeyboardLayout
			keys={navKeys}
			columns={3}
			rows={1}
			plateColor="#272727"
		/>
	);
}
