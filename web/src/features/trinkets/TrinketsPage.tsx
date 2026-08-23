import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useState } from "react";
import { UserTrinkets } from "./UserTrinkets";
import { CommunityTrinkets } from "./CommunityTrinkets";
import { CreateTrinketWidget } from "../widgets/CreateTrinketWidget";
import { useSetSidebar } from "../../hooks/useSetSidebar";
import { FriendsTrinkets } from "./FriendsTrinkets";
import { TrinketTabBar } from "./TrinketTabBar";

import pageStyles from "../../styles/MainPage.module.css";
import type { TrinketType } from "@shared/types";
import { FilterTrinketsWidget } from "../widgets/FilterTrinketsWidget";

type TrinketView = "self" | "friends" | "community";

export function TrinketsPage() {
	const [filter, setFilter] = useState<TrinketType | "all">("all");

	useSetSidebar(
		<FilterTrinketsWidget
			filter={filter}
			setFilter={setFilter}
		/>,
	);

	const username = useSelector((state: RootState) => state.auth.user!.username);
	const [view, setView] = useState<TrinketView>("self");

	return (
		<div className={pageStyles.pageContainer}>
			<div className={pageStyles.pageHeader}>
				<h1 className={pageStyles.pageTitle}>Trinkets</h1>

				<TrinketTabBar
					activeTab={view}
					setActiveTab={setView}
				/>
			</div>

			<div className={pageStyles.pageMain}>
				{view === "self" && username ? (
					<UserTrinkets
						username={username}
						filter={filter}
					/>
				) : view === "friends" ? (
					<FriendsTrinkets filter={filter} />
				) : (
					<CommunityTrinkets filter={filter} />
				)}
			</div>
		</div>
	);
}
