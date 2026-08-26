import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useState } from "react";
import { UserTrinkets } from "./UserTrinkets";
import { CommunityTrinkets } from "./CommunityTrinkets";
import { useSetSidebar } from "../../hooks/useSetSidebar";
import { FriendsTrinkets } from "./FriendsTrinkets";
import { TrinketTabBar } from "./TrinketTabBar";
import type { TrinketType } from "@shared/types";
import { FilterTrinketsWidget } from "../widgets/FilterTrinketsWidget";

import pageStyles from "../../styles/MainPage.module.css";
import trinketStyles from "./Trinkets.module.css";
import { useCreateTrinket } from "../../hooks/useCreateTrinket";
import { CreateTrinketToolbar } from "./CreateTrinketToolbar";
import { CreateTrinketForm } from "./CreateTrinketForm";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export type TrinketView = "self" | "friends" | "community";

export function TrinketsPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const segments = location.pathname.split("/").filter(Boolean);
	const rawView = segments[1];
	const view: TrinketView = rawView === "friends" || rawView === "community" ? rawView : "self";
	const username = useSelector((state: RootState) => state.auth.user!.username);

	const [searchParams, setSearchParams] = useSearchParams();
	const filter = (searchParams.get("type") as TrinketType | null) ?? "all";

	function setFilter(next: TrinketType | "all") {
		setSearchParams(next === "all" ? {} : { type: next });
	}

	useSetSidebar(
		<FilterTrinketsWidget
			filter={filter}
			setFilter={setFilter}
		/>,
	);

	const [isCreating, setIsCreating] = useState(false);
	const create = useCreateTrinket();

	async function handleSubmit() {
		const success = await create.submit();
		if (success) setIsCreating(false);
	}

	return (
		<div className={pageStyles.pageContainer}>
			<div className={pageStyles.pageHeader}>
				<h1 className={pageStyles.pageTitle}>Trinkets</h1>
				<div className={pageStyles.viewBar}>
					<TrinketTabBar
						activeTab={view ?? "self"}
						setActiveTab={(nextView) => navigate(`/trinkets/${nextView}`)}
					/>
				</div>
			</div>

			<div className={pageStyles.pageMain}>
				<div className={trinketStyles.headerRow}>
					<h2 className={trinketStyles.sectionTitle}>Create</h2>
					<CreateTrinketToolbar
						isCreating={isCreating}
						onToggleCreate={() => setIsCreating((prev) => !prev)}
						onSubmit={handleSubmit}
						hasTitle={create.hasTitle}
						isBusy={create.isBusy}
					/>
				</div>

				<div
					className={trinketStyles.createDrawer}
					data-expanded={isCreating}>
					<div className={trinketStyles.drawerInner}>
						<CreateTrinketForm create={create} />
					</div>
				</div>
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
