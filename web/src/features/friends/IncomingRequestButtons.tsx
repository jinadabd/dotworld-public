import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";
import { useFriendshipActions } from "./useFriendshipActions";

export function IncomingRequestButtons({ friendId }: { friendId: number }) {
	const { acceptFriendRequest, rejectFriendRequest } = useFriendshipActions();

	const requestButtons: KeyPosition[] = [
		{
			id: "acceptButton",
			col: 1,
			row: 1,
			colSpan: 2,
			keycapProps: {
				type: "button",
				colour: "blue",
				onRelease: () => acceptFriendRequest(friendId),
				children: "Accept",
			},
		},
		{
			id: "rejectButton",
			col: 3,
			row: 1,
			colSpan: 2,
			keycapProps: {
				type: "button",
				colour: "cream",
				onRelease: () => rejectFriendRequest(friendId),
				children: "Reject",
			},
		},
	];

	return (
		<KeyboardLayout
			keys={requestButtons}
			columns={2}
			rows={1}
			plateColor="#272727"
		/>
	);
}
