import { createContext, useContext, useState, type ReactNode } from "react";

const SidebarSlotContext = createContext<{
	content: ReactNode;
	setContent: (node: ReactNode) => void;
} | null>(null);

export function SidebarSlotProvider({ children }: { children: ReactNode }) {
	const [content, setContent] = useState<ReactNode>(null);
	return (
		<SidebarSlotContext.Provider value={{ content, setContent }}>
			{children}
		</SidebarSlotContext.Provider>
	);
}

export function useSidebarSlot() {
	const context = useContext(SidebarSlotContext);
	if (!context) throw new Error("useSidebarSlot must be within a SidebarSlotProvider");
	return context;
}
