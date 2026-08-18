import { useParams } from "react-router-dom";
import { useGetIslandByUsernameQuery } from "./islandApi";
import { extractErrorMessage } from "../../utils/errors";
import { SetUpIslandForm } from "./SetUpIslandForm";
import type { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useGetUserTrinketsQuery } from "../trinkets/trinketApi";
import { TrinketCard } from "../trinkets/TrinketCard";
import { CreateTrinketForm } from "../trinkets/CreateTrinketForm";
import { UserTrinkets } from "../trinkets/UserTrinkets";

type IslandView = "posts" | "trinkets";

export function IslandPage() {
	const { username } = useParams<{ username: string }>();
	const myUsername = useSelector((state: RootState) => state.auth.user!.username);

	if (!username) return <p>No Island specified</p>;
	const isOwnIsland = username === myUsername;

	const [view, setView] = useState<IslandView>("posts");
	const [isCreatingTrinket, setIsCreatingTrinket] = useState(false);

	const {
		data: island,
		isLoading: isIslandLoading,
		error: islandError,
	} = useGetIslandByUsernameQuery({ username });

	if (isIslandLoading) return <p>Loading...</p>;
	if (!island) {
		if (isOwnIsland) return <SetUpIslandForm username={username} />;
		return <p>This user doesn't have an Island yet. {":("}</p>;
	}

	if (islandError) return <p>{extractErrorMessage(islandError)}</p>;

	return (
		<div>
			<div>
				<h1>{island!.name ?? `${username}'s Island`}</h1>
				<p>{island!.description}</p>
				{island.cover_url && <img src={island.cover_url} />}
			</div>
			{/* View Selector */}
			<div>
				<button
					onClick={() => setView("posts")}
					disabled={view === "posts"}>
					Posts
				</button>
				<button
					onClick={() => setView("trinkets")}
					disabled={view === "trinkets"}>
					Trinkets
				</button>
			</div>

			{/* View Content */}
			{view === "posts" && (
				<div>
					<h2>Posts</h2>
					{/* User posts list component */}
				</div>
			)}

			{view === "trinkets" && (
				<UserTrinkets
					username={username}
					isOwnIsland={isOwnIsland}
				/>
			)}
		</div>
	);
}
