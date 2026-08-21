import { Keycap } from "../components/buttons/Keycap";
import { LogoutButton } from "../features/auth/LogoutButton";
import { DotworldWidget } from "../features/widgets/DotworldWidget";
import { PlaylistWdiget } from "../features/widgets/PlaylistWidget";

export function RightPanel() {
	return (
		<>
			<DotworldWidget />
			{/* <PlaylistWdiget /> */}
			<LogoutButton />
		</>
	);
}
