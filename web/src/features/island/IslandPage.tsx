import { useParams, useLocation, Navigate } from "react-router-dom";
import { useGetIslandByUsernameQuery } from "./islandApi";
import { SetUpIslandForm } from "./SetUpIslandForm";
import type { RootState } from "../../app/store";
import { useSelector } from "react-redux";
import { LockedIsland } from "./LockedIsland";
import { UnlockedIsland } from "./UnlockedIsland";
import { useSetSidebar } from "../../hooks/useSetSidebar";
import { FriendshipButton } from "../../components/buttons/FriendshipButton";
import { useGetFriendshipQuery } from "../friends/friendsApi";
import { BlankIsland } from "./BlankIsland";

export function IslandPage() {
	const { username } = useParams<{ username: string }>();
	const location = useLocation();
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

	const sidebarNode = isOwnIsland ? null : data?.user && !isFriendshipLoading ? (
		<FriendshipButton
			userId={data.user.id}
			status={status}
			isIncoming={isIncoming}
		/>
	) : null;

	useSetSidebar(sidebarNode);

	if (!username) return <p>No Island specified</p>;
	if (isIslandLoading) return <p>Loading {username}'s Island...</p>;

	const segments = location.pathname.split("/").filter(Boolean);
	const hasSubPath = segments.length > 1; // True if e.g. /username/chatter or /username/trinkets

	// CASE 1: Island not setup OR locked -> Must stay strictly on `/:username`
	if (!data || !data.island || data.locked) {
		if (hasSubPath) {
			return (
				<Navigate
					to={`/${username}`}
					replace
				/>
			);
		}

		if (!data) {
			return <p>Error.</p>;
		}

		if (!data.island && data.user) {
			return isOwnIsland ? (
				<SetUpIslandForm
					username={username}
					userId={data.user.id}
				/>
			) : (
				<BlankIsland user={data.user} />
			);
		}

		return (
			<LockedIsland
				user={data.user}
				isIncoming={isIncoming}
			/>
		);
	}

	if (!hasSubPath) {
		return (
			<Navigate
				to={`/${username}/chatter`}
				replace
			/>
		);
	}

	return <UnlockedIsland islandWithContent={data} />;
}
