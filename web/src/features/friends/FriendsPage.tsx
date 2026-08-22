import { useSetSidebar } from "../../hooks/useSetSidebar";
import { UserSearchWidget } from "../widgets/UserSearchWidget";
import { FriendsTabBar } from "./FriendsTabBar";
import { useState } from "react";
import { FriendsView } from "./FriendsView";
import { RequestsView } from "./RequestsView";
import { PendingView } from "./PendingView";

import pageStyles from "../../styles/MainPage.module.css";

type FriendsView = "friends" | "requests" | "pending";

export function FriendsPage() {
	useSetSidebar(<UserSearchWidget />);
	const [view, setView] = useState<FriendsView>("friends");

	return (
		<div className={pageStyles.pageContainer}>
			<div className={pageStyles.pageHeader}>
				<h1 className={pageStyles.pageTitle}>Friends</h1>

				<FriendsTabBar
					activeTab={view}
					setActiveTab={setView}
				/>
			</div>

			<div className={pageStyles.pageMain}>
				{view === "friends" ? (
					<FriendsView />
				) : view === "requests" ? (
					<RequestsView />
				) : (
					<PendingView />
				)}
			</div>
		</div>
	);
}
