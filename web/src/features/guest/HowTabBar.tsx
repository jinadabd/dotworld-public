import type { ButtonHTMLAttributes } from "react";
import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	activeTab: string;
	setActiveTab: React.Dispatch<
		React.SetStateAction<"island" | "trinkets" | "friends" | "chatter">
	>;
}

export function HowTabBar({ activeTab, setActiveTab }: Props) {
	const navKeys: KeyPosition[] = [
		{
			id: "islandTab",
			col: 1,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "yellow",
				isActive: activeTab === "island",
				onPress: () => setActiveTab("island"),
				children: "Island",
			},
		},
		{
			id: "trinketsTab",
			col: 3,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "green",
				isActive: activeTab === "trinkets",
				onPress: () => setActiveTab("trinkets"),
				children: "Trinkets",
			},
		},
		{
			id: "friendsTab",
			col: 5,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "blue",
				isActive: activeTab === "friends",
				onPress: () => setActiveTab("friends"),
				children: "Friends",
			},
		},
		{
			id: "chatterTab",
			col: 7,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "red",
				isActive: activeTab === "chatter",
				onPress: () => setActiveTab("chatter"),
				children: "Chatter",
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
