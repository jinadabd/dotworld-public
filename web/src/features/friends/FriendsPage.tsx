import { FriendsTabBar } from "./FriendsTabBar";
import { useEffect, useState } from "react";
import { FriendsView } from "./FriendsView";
import { RequestsView } from "./RequestsView";
import { PendingView } from "./PendingView";
import { useSidebarSlot } from "../../context/SidebarSlotContext";

import pageStyles from "../../styles/MainPage.module.css";
import friendStyles from "./Friends.module.css";
import { SearchToolbar } from "./SearchToolbar";
import { useSearchUsers } from "../../hooks/useSearchUsers";
import { SearchUsersForm } from "./SearchUsersForm";

type FriendsView = "friends" | "requests" | "pending";

export function FriendsPage() {
	const { setContent } = useSidebarSlot();
	useEffect(() => {
		setContent(null);
		return () => setContent(null);
	}, [setContent]);

	const [view, setView] = useState<FriendsView>("friends");

	const [isSearching, setIsSearching] = useState(false);
	const search = useSearchUsers();

	function handleToggleSearch() {
		setIsSearching((prev) => {
			const nextState = !prev;
			// If we are toggling it CLOSED, clear the search state
			if (!nextState) {
				search.resetSearch();
			}
			return nextState;
		});
	}

	async function handleSubmit() {
		const success = await search.submit();
	}

	return (
		<div className={pageStyles.pageContainer}>
			<div className={pageStyles.pageHeader}>
				<h1 className={pageStyles.pageTitle}>Friends</h1>
				<div className={pageStyles.viewBar}>
					<FriendsTabBar
						className={pageStyles.viewBar}
						activeTab={view}
						setActiveTab={setView}
					/>
				</div>
			</div>

			<div className={pageStyles.pageMain}>
				<div className={friendStyles.headerRow}>
					<h2 className={friendStyles.sectionTitle}>Search</h2>
					<SearchToolbar
						isSearching={isSearching}
						onToggleSearch={handleToggleSearch}
						onSubmit={handleSubmit}
						hasContent={search.hasContent}
						isBusy={search.isBusy}
					/>
				</div>
				<div
					className={friendStyles.composeDrawer}
					data-expanded={isSearching}>
					<div className={friendStyles.drawerInner}>
						<SearchUsersForm search={search} />
					</div>
				</div>

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
