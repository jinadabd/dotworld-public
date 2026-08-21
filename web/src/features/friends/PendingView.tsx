import { useGetFriendshipPendingQuery } from "./friendsApi";
import { FetchedUserBadge } from "../users/FetchedUserBadge";
import styles from "./Friends.module.css";
import { TactileButton } from "../../components/buttons/TactileButton";
import { useFriendshipActions } from "./useFriendshipActions";

export function PendingView({ providedStyle }: { providedStyle?: CSSModuleClasses }) {
	const { data: pending, isLoading } = useGetFriendshipPendingQuery();
	const { cancelFriendRequest } = useFriendshipActions();

	return (
		<div className={styles.friendsView}>
			<h2 className={styles.viewHeader}>Pending Friend Requests</h2>
			{isLoading && <p className={styles.statusMessage}>Loading...</p>}
			<div className={styles.friendsList}>
				{(!pending || pending.length === 0) && (
					<p className={styles.statusMessage}>
						You don't have any pending friend requests. {`:(`}
					</p>
				)}
				{pending &&
					pending.map((req) => (
						<FetchedUserBadge
							key={req.friend_id}
							userId={req.friend_id}
							style={providedStyle}>
							<TactileButton onRelease={() => cancelFriendRequest(req.friend_id)}>
								Cancel
							</TactileButton>
						</FetchedUserBadge>
					))}
			</div>
		</div>
	);
}
