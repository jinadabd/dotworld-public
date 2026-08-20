import { useEffect, type ReactNode } from "react";
import { useSidebarSlot } from "../context/SidebarSlotContext";

export function useSetSidebar(node: ReactNode) {
	const { setContent } = useSidebarSlot();

	useEffect(() => {
		setContent(node);
		return () => setContent(null);
	}, [node]);
}
