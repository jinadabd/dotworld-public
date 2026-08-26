import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSidebarSlot } from "../context/SidebarSlotContext";
import { KeycapNav } from "../components/buttons/KeycapNav";
import styles from "./AppLayout.module.css";

export function LeftPanel() {
	const { content } = useSidebarSlot();
	const location = useLocation();
	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {
		setIsExpanded(false);
	}, [location.pathname]);

	const toggleExpand = () => setIsExpanded((prev) => !prev);
	const hasContent = Boolean(content);

	return (
		<>
			{hasContent && (
				<div className={`${styles.mobileDrawer} ${isExpanded ? styles.expanded : ""}`}>
					{content}
				</div>
			)}

			<KeycapNav
				isExpanded={isExpanded}
				onToggleExpand={toggleExpand}
				hasSlotContent={hasContent}
			/>

			<div className={styles.divide} />

			{/* Desktop inline slot */}
			<div className={styles.desktopSlot}>{content}</div>
		</>
	);
}
