import type { ButtonHTMLAttributes } from "react";
import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	activeTab: string;
	setActiveTab: React.Dispatch<React.SetStateAction<"unread" | "read">>;
}

export function ChatterTabBar({ activeTab, setActiveTab }: Props) {
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
	];

	return (
		<KeyboardLayout
			keys={navKeys}
			columns={2}
			rows={1}
			plateColor="#272727"
		/>
	);
}
