import { useSidebarSlot } from "../context/SidebarSlotContext";
import { KeycapNav } from "../components/buttons/KeycapNav";
import styles from "./AppLayout.module.css";

export function LeftPanel() {
	const slot = useSidebarSlot();
	return (
		<>
			<KeycapNav />
			<div className={styles.divide} />
			{slot?.content}
		</>
	);
}
