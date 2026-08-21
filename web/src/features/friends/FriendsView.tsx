import { useSelector } from "react-redux";
import { useGetFriendsQuery } from "./friendsApi";
import type { RootState } from "../../app/store";
import { FetchedUserBadge } from "../users/FetchedUserBadge";
import styles from "./Friends.module.css";
import { RemoveFriendButton } from "./RemoveFriendButton";

export function FriendsView({ providedStyle }: { providedStyle?: CSSModuleClasses }) {
	const { data: friends, isLoading } = useGetFriendsQuery();
	const myId = useSelector((state: RootState) => state.auth.user!.id);
	return (
		<div className={styles.friendsView}>
			<h2 className={styles.viewHeader}>My Friends</h2>
			{isLoading && <p className={styles.statusMessage}>Loading...</p>}
			<div className={styles.friendsList}>
				{!friends && (
					<p className={styles.statusMessage}>You don't have any friends yet :&lpar;</p>
				)}
				{friends &&
					friends.map((friendship) => {
						const otherUserId =
							friendship.user_id === myId ? friendship.friend_id : friendship.user_id;
						return (
							<FetchedUserBadge
								key={friendship.friend_id}
								userId={otherUserId}
								style={providedStyle}>
								<RemoveFriendButton friendId={otherUserId} />
							</FetchedUserBadge>
						);
					})}
			</div>
		</div>
	);
}
