import type { IslandWithContent } from "@shared/types";
import { useState } from "react";
import { UserPosts } from "../posts/UserPosts";
import { UserTrinkets } from "../trinkets/UserTrinkets";
import { FeaturedTrinketWidget } from "./FeaturedTrinketWidget";
import { IslandTabBar } from "./IslandTabBar";

import pageStyles from "../../styles/MainPage.module.css";

type IslandView = "posts" | "trinkets";

interface Props {
	islandWithContent: IslandWithContent;
}

export function UnlockedIsland({ islandWithContent }: Props) {
	const [view, setView] = useState<IslandView>("posts");
	const { island, user, featured_trinkets } = islandWithContent;

	return (
		<div className={pageStyles.pageContainer}>
			<div className={pageStyles.pageHeader}>
				<h1 className={pageStyles.pageTitle}>
					{/* {island.name ?? `${user.name}'s Island`} */}
					{`${user.name}'s Island`}
				</h1>

				<IslandTabBar
					activeTab={view}
					setActiveTab={setView}
				/>
				<p className={""}>@{user.name}</p>
				{island.description && <p className={""}>{island.description}</p>}
				{island.cover_url && (
					<img
						className={""}
						src={island.cover_url}
						alt="Island Cover Image"
					/>
				)}
				<div className={""}>
					{featured_trinkets.map((trinket) => (
						<FeaturedTrinketWidget
							key={trinket.id}
							trinket={trinket}
						/>
					))}
				</div>
			</div>

			<div className={pageStyles.pageMain}>
				{view === "posts" && <UserPosts username={user.username} />}
				{view === "trinkets" && <UserTrinkets username={user.username} />}
			</div>
		</div>
	);
}
