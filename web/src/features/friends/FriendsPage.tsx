import { TactileButton } from "../../components/buttons/TactileButton";
import { useGetFriendsQuery, useGetPendingFriendRequestsQuery } from "./friendsApi";
import { useFriendshipActions } from "./useFriendshipActions";
import { FetchedUserBadge } from "../users/FetchedUserBadge";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useSetSidebar } from "../../hooks/useSetSidebar";
import { UserSearchWidget } from "../widgets/UserSearchWidget";

export function FriendsPage() {
	useSetSidebar(<UserSearchWidget />);

	const { data: friends, isLoading } = useGetFriendsQuery();
	const { data: requests } = useGetPendingFriendRequestsQuery();
	const { acceptFriendRequest, rejectFriendRequest, cancelFriendRequest } =
		useFriendshipActions();

	const myId = useSelector((state: RootState) => state.auth.user!.id);
	return (
		<>
			<h1>Friends</h1>

			<div>
				{requests && requests.length > 0 && (
					<section>
						<h2>Requests</h2>
						{requests.map((req) => (
							<FetchedUserBadge userId={req.user_id}>
								<div key={req.user_id}>
									<TactileButton
										colour="blue"
										onClick={() => acceptFriendRequest(req.user_id)}>
										Accept
									</TactileButton>
									<TactileButton
										colour="cream"
										onClick={() => rejectFriendRequest(req.user_id)}>
										Reject
									</TactileButton>
								</div>
							</FetchedUserBadge>
						))}
					</section>
				)}

				<section>
					<h2>My Friends</h2>
					{friends?.map((friendship) => {
						const otherUserId =
							friendship.user_id === myId ? friendship.friend_id : friendship.user_id;
						return (
							<FetchedUserBadge
								key={friendship.id}
								userId={otherUserId}
							/>
						);
					})}
				</section>
			</div>
		</>
	);
}
