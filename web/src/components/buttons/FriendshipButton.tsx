import type { FriendshipStatus } from "@shared/types";
import {
	useChangeFriendshipStatusMutation,
	useRemoveFriendMutation,
	useSendFriendRequestMutation,
} from "../../features/friends/friendsApi";
import { TactileButton } from "./TactileButton";
// import { TactileButtonWithCap } from "./TactileButtonWithCap";

interface Props {
	userId: number;
	status: FriendshipStatus | null;
	isIncoming: boolean;
}

export function FriendshipButton({ userId, status, isIncoming }: Props) {
	const [sendRequest, { isLoading: sending }] = useSendFriendRequestMutation();
	const [changeRequest, { isLoading: changing }] = useChangeFriendshipStatusMutation();
	const [removeFriend, { isLoading: removing }] = useRemoveFriendMutation();
	const isBusy = sending || changing || removing;

	if (status === null) {
		return (
			<TactileButton
				colour="blue"
				disabled={isBusy}
				onPress={() => sendRequest({ friendId: userId })}>
				Add friend
			</TactileButton>
		);
	}

	if (status === "friends") {
		return (
			<TactileButton
				colour="cream"
				disabled={isBusy}
				onPress={() => removeFriend({ friendId: userId })}>
				Remove
			</TactileButton>
		);
	}

	if (isIncoming) {
		return (
			<div>
				<TactileButton
					colour="blue"
					disabled={isBusy}
					onPress={() => changeRequest({ friendId: userId, change: "accept" })}>
					Accept
				</TactileButton>
				<TactileButton
					colour="cream"
					disabled={isBusy}
					onPress={() => changeRequest({ friendId: userId, change: "reject" })}>
					Reject
				</TactileButton>
			</div>
		);
	}

	return (
		<TactileButton
			colour="cream"
			disabled={isBusy}
			onPress={() => changeRequest({ friendId: userId, change: "cancel" })}>
			Cancel
		</TactileButton>
	);
}
