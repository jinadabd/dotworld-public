import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { Link } from "react-router-dom";
import { TactileButton, type Colours } from "./TactileButton";
import type { HTMLAttributes } from "react";

export type Page = "Island" | "Trinkets" | "Friends" | "Chatter";

const colour: Record<Page, Colours> = {
	Island: "yellow",
	Trinkets: "green",
	Friends: "blue",
	Chatter: "red",
};

interface Props extends HTMLAttributes<HTMLButtonElement> {
	page: Page;
}

export function NavButton({ page, ...rest }: Props) {
	const iconSrc = new URL(`../../assets/icons/${page.toLowerCase()}.svg`, import.meta.url).href;
	const icon = (
		<img
			src={iconSrc}
			alt={`${page} icon`}
		/>
	);

	const username = useSelector((state: RootState) => state.auth.user!.username);
	const link = page === "Island" ? `/${username}` : `/${page.toLowerCase()}`;

	return (
		<Link to={link}>
			<TactileButton
				colour={colour[page]}
				icon={icon}
				{...rest}>
				{page}
			</TactileButton>
		</Link>
	);
}
