import { useSidebarSlot } from "../context/SidebarSlotContext";
import { KeycapNav } from "../components/buttons/KeycapNav";

export function LeftPanel() {
	const slot = useSidebarSlot();
	return (
		<>
			<KeycapNav />
			{slot?.content}
		</>
	);
}
