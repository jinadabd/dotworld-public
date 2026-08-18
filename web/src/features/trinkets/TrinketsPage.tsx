import { useGetUserTrinketsQuery, useGetCommunityTrinketsQuery } from "./trinketApi";
import { TrinketCard } from "./TrinketCard";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useState } from "react";
import { UserTrinkets } from "./UserTrinkets";
import { CommunityTrinkets } from "./CommunityTrinkets";

type TrinketView = "self" | "friends" | "community";

export function TrinketsPage() {
	const username = useSelector((state: RootState) => state.auth.user!.username);
	const [view, setView] = useState<TrinketView>("self");

	return (
		<div>
			<div>
				<h1>Trinkets</h1>

				<div>
					{username && (
						<button
							onClick={() => setView("self")}
							disabled={view === "self"}>
							Self
						</button>
					)}
					<button
						onClick={() => setView("community")}
						disabled={view === "community"}>
						Community
					</button>
				</div>
			</div>

			{view === "self" && username ? (
				<UserTrinkets username={username} />
			) : (
				<CommunityTrinkets />
			)}
		</div>
	);
}
