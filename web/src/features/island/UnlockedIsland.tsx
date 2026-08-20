import type { IslandWithContent, PublicUser } from "@shared/types";
import { useState } from "react";
import { TactileButton } from "../../components/buttons/TactileButton";
import { UserPosts } from "../posts/UserPosts";
import { UserTrinkets } from "../trinkets/UserTrinkets";
import { FeaturedTrinketWidget } from "./FeaturedTrinketWidget";

type IslandView = "posts" | "trinkets";

interface Props {
	islandWithContent: IslandWithContent;
	isOwnIsland?: boolean;
}

export function UnlockedIsland({ islandWithContent, isOwnIsland = false }: Props) {
	const [view, setView] = useState<IslandView>("posts");
	const { island, user, featured_trinkets } = islandWithContent;
	return (
		<div>
			<div>
				<h1>{island.name ?? `${user.name}'s Island`}</h1>
				<p>{island.description}</p>
				{island.cover_url && (
					<img
						src={island.cover_url}
						alt="Island Cover Image"
					/>
				)}
				<div>
					{featured_trinkets.map((trinket) => (
						<FeaturedTrinketWidget trinket={trinket} />
					))}
				</div>
			</div>

			<div>
				<TactileButton
					colour="red"
					onPress={() => setView("posts")}
					active={view === "posts"}>
					Posts
				</TactileButton>
				<TactileButton
					colour="green"
					onPress={() => setView("trinkets")}
					active={view === "trinkets"}>
					Trinkets
				</TactileButton>
			</div>

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
	);
}
