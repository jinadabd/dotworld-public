import type { ButtonHTMLAttributes } from "react";
import type { RootState } from "../../app/store";
import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	activeTab: string;
	setActiveTab: React.Dispatch<React.SetStateAction<"unread" | "read" | "all">>;
	markAsRead: () => void;
}

export function ChatterTabBar({ activeTab, setActiveTab, markAsRead }: Props) {
	const navKeys: KeyPosition[] = [
		{
			id: "unreadTab",
			col: 1,
			row: 1,
			colSpan: 2,
			keycapProps: {
				className: `${"red"}`.trim(),
				colour: "red",
				legend: "1",
				isActive: activeTab === "unread",
				onPress: () => setActiveTab("unread"),
				children: "Unread",
			},
		},
		{
			id: "readTab",
			col: 3,
			row: 1,
			colSpan: 2,
			keycapProps: {
				className: `${"red"}`.trim(),
				colour: "red",
				legend: "2",
				isActive: activeTab === "read",
				onPress: () => setActiveTab("read"),
				children: "Read",
			},
		},
		{
			id: "allTab",
			col: 5,
			row: 1,
			colSpan: 2,
			keycapProps: {
				className: `${"red"}`.trim(),
				colour: "red",
				legend: "3",
				isActive: activeTab === "all",
				onPress: () => setActiveTab("all"),
				children: "All",
			},
		},
		{
			id: "markTab",
			col: 7,
			row: 1,
			colSpan: 3,
			keycapProps: {
				className: `${"red"}`.trim(),
				colour: "red",
				legend: "⬤",
				onPress: markAsRead,
				children: "Mark All as Read",
			},
		},
	];

	return (
		<KeyboardLayout
			keys={navKeys}
			columns={5}
			rows={1}
			plateColor="#272727"
		/>
	);
}
