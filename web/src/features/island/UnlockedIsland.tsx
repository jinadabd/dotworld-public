import type { IslandWithContent } from "@shared/types";
import { useLocation, useNavigate } from "react-router-dom";
import { UserPosts } from "../posts/UserPosts";
import { UserTrinkets } from "../trinkets/UserTrinkets";
import { IslandTabBar } from "./IslandTabBar";

import pageStyles from "../../styles/MainPage.module.css";
import trinketStyles from "../trinkets/Trinkets.module.css";

import { CreateTrinketToolbar } from "../trinkets/CreateTrinketToolbar";
import { CreateTrinketForm } from "../trinkets/CreateTrinketForm";
import { useState } from "react";
import { useCreateTrinket } from "../../hooks/useCreateTrinket";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

type IslandView = "chatter" | "trinkets";

interface Props {
	islandWithContent: IslandWithContent;
}

export function UnlockedIsland({ islandWithContent }: Props) {
	const navigate = useNavigate();
	const location = useLocation();

	const segments = location.pathname.split("/").filter(Boolean);
	const rawView = segments[1];
	const view: IslandView = rawView === "trinkets" ? "trinkets" : "chatter";

	const { user } = islandWithContent;

	const [isCreating, setIsCreating] = useState(false);
	const create = useCreateTrinket();

	const { id: myId, username: myUsername } = useSelector((state: RootState) => state.auth.user!);

	const isOwnIsland = user.username === myUsername;

	async function handleSubmit() {
		const success = await create.submit();
		if (success) setIsCreating(false);
	}

	return (
		<div className={pageStyles.pageContainer}>
			<div className={pageStyles.pageHeader}>
				<h1 className={pageStyles.pageTitle}>
					{isOwnIsland ? "Your Island" : `${user.name}'s Island`}
				</h1>
				<div className={pageStyles.viewBar}>
					<IslandTabBar
						activeTab={view}
						setActiveTab={(nextView) => navigate(`/${user.username}/${nextView}`)}
					/>
				</div>
			</div>

			<div className={pageStyles.pageMain}>
				{view === "chatter" && <UserPosts username={user.username} />}
				{view === "trinkets" && (
					<>
						<div className={trinketStyles.headerRow}>
							<h2 className={trinketStyles.sectionTitle}>
								{isOwnIsland ? "Your Trinkets" : "Trinkets"}
							</h2>
							{isOwnIsland && (
								<CreateTrinketToolbar
									isCreating={isCreating}
									onToggleCreate={() => setIsCreating((prev) => !prev)}
									onSubmit={handleSubmit}
									hasTitle={create.hasTitle}
									isBusy={create.isBusy}
								/>
							)}
						</div>
						<div
							className={trinketStyles.createDrawer}
							data-expanded={isCreating}>
							<div className={trinketStyles.drawerInner}>
								<CreateTrinketForm create={create} />
							</div>
						</div>
						<UserTrinkets
							username={user.username}
							filter="all"
						/>
					</>
				)}
			</div>
		</div>
	);
}
