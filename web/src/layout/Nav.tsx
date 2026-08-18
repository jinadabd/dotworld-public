import { NavButton, type Page } from "../components/buttons/NavButton";

export function Nav() {
	const pages: Page[] = ["Island", "Trinkets", "Friends", "Chatter"];
	return (
		<nav>
			{pages.map((page) => (
				<NavButton
					key={page}
					page={page}
				/>
			))}
		</nav>
	);
}
