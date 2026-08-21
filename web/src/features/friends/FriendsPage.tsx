import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useSetSidebar } from "../../hooks/useSetSidebar";
import { UserSearchWidget } from "../widgets/UserSearchWidget";
import { FriendsTabBar } from "./FriendsTabBar";
import { useState } from "react";
import { FriendsView } from "./FriendsView";
import { RequestsView } from "./RequestsView";
import { PendingView } from "./PendingView";

type FriendsView = "friends" | "requests" | "pending";

export function FriendsPage() {
	useSetSidebar(<UserSearchWidget />);
	const [view, setView] = useState<FriendsView>("friends");

	const myId = useSelector((state: RootState) => state.auth.user!.id);
	return (
		<>
			<div>
				<h1>Friends</h1>
				<FriendsTabBar
					activeTab={view}
					setActiveTab={setView}
				/>
			</div>

			{view === "friends" ? (
				<FriendsView />
			) : view === "requests" ? (
				<RequestsView />
			) : (
				<PendingView />
			)}
		</>
	);
}
