import { Outlet } from "react-router-dom";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";
import styles from "./AppLayout.module.css";
import { SidebarSlotProvider } from "../context/SidebarSlotContext";

export function AppLayout() {
	return (
		<SidebarSlotProvider>
			<div className={styles.layout}>
				<aside className={styles.leftPanel}>
					<LeftPanel />
				</aside>
				<main className={styles.mainView}>
					<Outlet />
				</main>
				<aside className={styles.rightPanel}>
					<RightPanel />
				</aside>
			</div>
		</SidebarSlotProvider>
	);
}
