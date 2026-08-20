import { Keycap } from "../components/buttons/Keycap";
import { LogoutButton } from "../features/auth/LogoutButton";

export function RightPanel() {
	return (
		<>
			<div>dotworld</div>
			<div>Playlists</div>
			<LogoutButton />
		</>
	);
}
