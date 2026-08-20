import type { PublicUser } from "@shared/types";
import { FriendshipButton } from "../../components/buttons/FriendshipButton";

export function LockedIsland({ user }: { user: PublicUser }) {
	return (
		<div>
			<h1>Locked</h1>
		</div>
	);
}
