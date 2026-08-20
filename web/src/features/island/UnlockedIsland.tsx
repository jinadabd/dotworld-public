import type { IslandWithContent, PublicUser } from "@shared/types";
import { useState } from "react";
import { UserPosts } from "../posts/UserPosts";
import { UserTrinkets } from "../trinkets/UserTrinkets";
import { FeaturedTrinketWidget } from "./FeaturedTrinketWidget";
import { IslandTabBar } from "./IslandTabBar";
import styles from "./Island.module.css";

type IslandView = "posts" | "trinkets";

interface Props {
	islandWithContent: IslandWithContent;
	isOwnIsland?: boolean;
}

export function UnlockedIsland({ islandWithContent, isOwnIsland = false }: Props) {
	const [view, setView] = useState<IslandView>("posts");
	const { island, user, featured_trinkets } = islandWithContent;
	return (
		<div className={styles.islandPage}>
			<div className={styles.headerCard}>
				<h1 className={styles.islandTitle}>
					{/* {island.name ?? `${user.name}'s Island`} */}
					{`${user.name}'s Island`}
				</h1>
				<p className={styles.islandUsername}>@{user.name}</p>
				{island.description && (
					<p className={styles.islandDescription}>{island.description}</p>
				)}
				{island.cover_url && (
					<img
						className={styles.coverImage}
						src={island.cover_url}
						alt="Island Cover Image"
					/>
				)}
				<div className={styles.featuredGrid}>
					{featured_trinkets.map((trinket) => (
						<FeaturedTrinketWidget
							key={trinket.id}
							trinket={trinket}
						/>
					))}
				</div>
			</div>

			<IslandTabBar
				className={styles.tabBarContainer}
				activeTab={view}
				setActiveTab={setView}
			/>

			<div className={styles.contentArea}>
				{view === "posts" && (
					<UserPosts
						username={user.username}
						isOwnIsland
					/>
				)}
				{view === "trinkets" && (
					<UserTrinkets
						username={user.username}
						isOwnIsland
					/>
				)}
			</div>
		</div>
	);
}
