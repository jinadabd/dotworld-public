import { useGetFriendRequestsQuery } from "./friendsApi";
import { FetchedUserBadge } from "../users/FetchedUserBadge";
import { IncomingRequestButtons } from "./IncomingRequestButtons";

import friendStyles from "./Friends.module.css";

export function RequestsView({ providedStyle }: { providedStyle?: CSSModuleClasses }) {
	const { data: requests, isLoading } = useGetFriendRequestsQuery();

	return (
		<>
			<div className={friendStyles.headerRow}>
				<h2 className={friendStyles.sectionTitle}>Incoming Requests</h2>
				{isLoading && <p className={friendStyles.statusMessage}>Loading...</p>}
			</div>

			<div className={friendStyles.friendsView}>
				{(!requests || requests.length === 0) && (
					<p className={friendStyles.statusMessage}>
						You don't have any incoming friend requests. {`:(`}
					</p>
				)}
				{requests &&
					requests.map((req) => (
						<div
							key={req.user_id}
							className={friendStyles.friendRow}>
							<FetchedUserBadge userId={req.user_id} />
							<IncomingRequestButtons friendId={req.user_id} />
						</div>
					))}
			</div>
		</>
	);
}
