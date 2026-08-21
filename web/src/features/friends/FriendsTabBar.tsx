import type { ButtonHTMLAttributes } from "react";
import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	activeTab: string;
	setActiveTab: React.Dispatch<React.SetStateAction<"friends" | "requests" | "pending">>;
}

export function FriendsTabBar({ activeTab, setActiveTab }: Props) {
	const navKeys: KeyPosition[] = [
		{
			id: "friendsTab",
			col: 1,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "blue",
				// legend: "",
				isActive: activeTab === "friends",
				onPress: () => setActiveTab("friends"),
				children: "Friends",
			},
		},
		{
			id: "requestsTab",
			col: 3,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "blue",
				legend: "⬤",
				isActive: activeTab === "requests",
				onPress: () => setActiveTab("requests"),
				children: "Requests",
			},
		},
		{
			id: "pendingTab",
			col: 5,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "blue",
				legend: "⬤",
				isActive: activeTab === "pending",
				onPress: () => setActiveTab("pending"),
				children: "Pending",
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
