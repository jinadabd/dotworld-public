import { About } from "./About";
import { How } from "./How";
import { LandingGrid } from "./LandingGrid";
import { Why } from "./Why";

export default function GuestPage() {
	return (
		<>
			<LandingGrid />
			<About />
			<Why />
			<How />
		</>
	);
}
