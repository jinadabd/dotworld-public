import { useParams } from "react-router-dom";
import { useGetIslandByUsernameQuery } from "./islandApi";
import { SetUpIslandForm } from "./SetUpIslandForm";
import type { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { LockedIsland } from "./LockedIsland";
import { UnlockedIsland } from "./UnlockedIsland";
import { useSetSidebar } from "../../hooks/useSetSidebar";
import { FriendshipButton } from "../../components/buttons/FriendshipButton";
import { useGetFriendshipQuery } from "../friends/friendsApi";

export function IslandPage() {
	const { username } = useParams<{ username: string }>();
	const { id: myId, username: myUsername } = useSelector((state: RootState) => state.auth.user!);

	const isOwnIsland = username === myUsername;

	const { data, isLoading: isIslandLoading } = useGetIslandByUsernameQuery(
		{ username: username ?? "" },
		{ skip: !username },
	);

	const { data: friendship, isLoading: isFriendshipLoading } = useGetFriendshipQuery(
		{ friendId: data?.user?.id ?? 0 },
		{ skip: !data?.user?.id || isOwnIsland },
	);

	const status = friendship?.friendship_status ?? null;
	const isIncoming = friendship?.friend_id === myId;

	const sidebarNode = isOwnIsland ? null : data?.user && !isFriendshipLoading ? ( //editislandbutton
		<FriendshipButton
			userId={data.user.id}
			status={status}
			isIncoming={isIncoming}
		/>
	) : null;

	useSetSidebar(sidebarNode);

	if (!username) return <p>No Island specified</p>;
	if (isIslandLoading) return <p>Loading {username}'s Island...</p>;

	if (!data || !data.island) {
		return isOwnIsland ? (
			<SetUpIslandForm username={username} />
		) : (
			<p>{username} doesn't have an island yet.</p>
		);
	}

	if (data.locked) {
		return <LockedIsland user={data.user} />;
	}

	return <UnlockedIsland islandWithContent={data} />;
}
