import { useSelector } from "react-redux";
import { useGetFriendRequestsQuery } from "./friendsApi";
import type { RootState } from "../../app/store";
import { FetchedUserBadge } from "../users/FetchedUserBadge";
import styles from "./Friends.module.css";
import { IncomingRequestButtons } from "./IncomingRequestButtons";

export function RequestsView({ providedStyle }: { providedStyle?: CSSModuleClasses }) {
	const { data: requests, isLoading } = useGetFriendRequestsQuery();

	return (
		<div className={styles.friendsView}>
			<h2 className={styles.viewHeader}>Incoming Friend Requests</h2>
			{isLoading && <p className={styles.statusMessage}>Loading...</p>}
			<div className={styles.friendsList}>
				{(!requests || requests.length === 0) && (
					<p className={styles.statusMessage}>
						You don't have any incoming friend requests. {`:(`}
					</p>
				)}
				{requests &&
					requests.map((req) => (
						<div key={req.user_id}>
							<FetchedUserBadge
								userId={req.user_id}
								style={providedStyle}>
								<IncomingRequestButtons friendId={req.user_id} />
							</FetchedUserBadge>
						</div>
					))}
			</div>
		</div>
	);
}
