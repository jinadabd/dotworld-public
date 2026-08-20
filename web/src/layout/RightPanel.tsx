import { Keycap } from "../components/buttons/Keycap";
import { LogoutButton } from "../features/auth/LogoutButton";
import { DotworldWidget } from "../features/widgets/DotworldWidget";

export function RightPanel() {
	return (
		<>
			<DotworldWidget />
			<div>Playlists</div>
			<LogoutButton />
		</>
	);
}
