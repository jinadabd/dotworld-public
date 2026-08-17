import { Outlet } from "react-router-dom";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";

export function AppLayout() {
	return (
		<div>
			<aside>
				<LeftPanel />
			</aside>
			<main>
				<Outlet />
			</main>
			<aside>
				<RightPanel />
			</aside>
		</div>
	);
}
