import { useChangeFriendshipStatusMutation } from "./friendsApi";

export function useFriendshipActions() {
	const [changeStatus, meta] = useChangeFriendshipStatusMutation();

	return {
		acceptFriendRequest: (friendId: number) => changeStatus({ friendId, change: "accept" }),
		rejectFriendRequest: (friendId: number) => changeStatus({ friendId, change: "reject" }),
		cancelFriendRequest: (friendId: number) => changeStatus({ friendId, change: "cancel" }),
		...meta,
	};
}
