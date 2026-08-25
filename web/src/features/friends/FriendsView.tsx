import { useSelector } from "react-redux";
import { useGetFriendsQuery } from "./friendsApi";
import type { RootState } from "../../app/store";
import { FetchedUserBadge } from "../users/FetchedUserBadge";
import { RemoveFriendButton } from "./RemoveFriendButton";

import friendStyles from "./Friends.module.css";

export function FriendsView() {
	const { data: friends, isLoading } = useGetFriendsQuery();
	const myId = useSelector((state: RootState) => state.auth.user!.id);

	return (
		<>
			{/* <div className={friendStyles.headerRow}>
				<h2 className={friendStyles.sectionTitle}>My Friends</h2>
				{isLoading && <p className={friendStyles.statusMessage}>Loading...</p>}
			</div> */}

			<div className={friendStyles.friendsView}>
				{!friends ||
					(friends.length === 0 && (
						<p className={friendStyles.statusMessage}>
							{`You don't have any friends yet :(`}
						</p>
					))}
				{friends &&
					friends.map((friendship) => {
						const otherUserId =
							friendship.user_id === myId ? friendship.friend_id : friendship.user_id;
						return (
							<div
								className={friendStyles.friendRow}
								key={friendship.id}>
								<div className={friendStyles.userBadge}>
									<FetchedUserBadge userId={otherUserId} />
								</div>
								<div className={friendStyles.removeButton}>
									<RemoveFriendButton friendId={otherUserId} />
								</div>
							</div>
						);
					})}
			</div>
		</>
	);
}
