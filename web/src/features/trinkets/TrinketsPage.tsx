import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useState } from "react";
import { UserTrinkets } from "./UserTrinkets";
import { CommunityTrinkets } from "./CommunityTrinkets";
import { CreateTrinketWidget } from "../widgets/CreateTrinketWidget";
import { useSetSidebar } from "../../hooks/useSetSidebar";
import { FriendsTrinkets } from "./FriendsTrinkets";

type TrinketView = "self" | "friends" | "community";

export function TrinketsPage() {
	useSetSidebar(<CreateTrinketWidget />);

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
						onClick={() => setView("friends")}
						disabled={view === "friends"}>
						Friends
					</button>
					<button
						onClick={() => setView("community")}
						disabled={view === "community"}>
						Community
					</button>
				</div>
			</div>

			{view === "self" && username ? (
				<UserTrinkets username={username} />
			) : view === "friends" ? (
				<FriendsTrinkets />
			) : (
				<CommunityTrinkets />
			)}
		</div>
	);
}
