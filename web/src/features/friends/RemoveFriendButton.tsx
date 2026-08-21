import { useState } from "react";
import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";
import { useRemoveFriendMutation } from "./friendsApi";
import { TactileButtonWithConfirm } from "../../components/buttons/TactileButtonWithConfirm";

export function RemoveFriendButton({ friendId }: { friendId: number }) {
	const [removeFriend, { isLoading: removing }] = useRemoveFriendMutation();

	return (
		<TactileButtonWithConfirm
			onRelease={() => removeFriend({ friendId })}
			color="blue">
			{removing ? "Removing" : "Remove"}
		</TactileButtonWithConfirm>
	);
}
