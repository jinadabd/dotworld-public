import { useGetFriendshipPendingQuery } from "./friendsApi";
import { FetchedUserBadge } from "../users/FetchedUserBadge";
import { TactileButton } from "../../components/buttons/TactileButton";
import { useFriendshipActions } from "./useFriendshipActions";

import friendStyles from "./Friends.module.css";

export function PendingView({ providedStyle }: { providedStyle?: CSSModuleClasses }) {
	const { data: pending, isLoading } = useGetFriendshipPendingQuery();
	const { cancelFriendRequest } = useFriendshipActions();

	return (
		<>
			<div className={friendStyles.headerRow}>
				<h2 className={friendStyles.sectionTitle}>Pending Requests</h2>
				{isLoading && <p className={friendStyles.statusMessage}>Loading...</p>}
			</div>

			<div className={friendStyles.friendsView}>
				{(!pending || pending.length === 0) && (
					<p className={friendStyles.statusMessage}>
						You don't have any pending friend requests. {`:(`}
					</p>
				)}
				{pending &&
					pending.map((req) => (
						<div className={friendStyles.friendRow}>
							<FetchedUserBadge
								key={req.friend_id}
								userId={req.friend_id}
							/>
							<TactileButton onRelease={() => cancelFriendRequest(req.friend_id)}>
								Cancel
							</TactileButton>
						</div>
					))}
			</div>
		</>
	);
}
