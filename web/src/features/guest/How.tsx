import { useState } from "react";
import styles from "./Guest.module.css";
import { IslandIcon, TrinketsIcon, FriendsIcon, ChatterIcon } from "../../components/buttons/icons";
import { HowTabBar } from "./HowTabBar";
import { TactileButton, type Colours } from "../../components/buttons/TactileButton";

type TabType = "island" | "trinkets" | "friends" | "chatter";

const PAGES: Record<
	TabType,
	{ colour: Colours; icon: React.ReactNode; title: string; desc: string }
> = {
	island: {
		colour: "yellow",
		icon: <IslandIcon size={26} />,
		title: "Island",
		desc: "Your own digital space. Set it up once, edit it whenever, and make it yours. Pin your favourite Trinkets and feature them on your Island, and visit your Friends' Islands to see how they curated theirs.",
	},
	trinkets: {
		colour: "green",
		icon: <TrinketsIcon size={26} />,
		title: "Trinkets",
		desc: "Build anything you like: laylists, galleries, collections, restaurant reviews, bucket lists. Share it with your Friends and the Community, or keep it yours. Browse your Friends' Trinkets, and check out what other Sailors in the Community have built.",
	},
	friends: {
		colour: "blue",
		icon: <FriendsIcon size={26} />,
		title: "Friends",
		desc: "Send requests, manage your Bubbles, find people you actually know. Discover new Friends through Community Trinkets, and choose the visibility of your Chatter and Trinkets depending on your Friends and Bubbles.",
	},
	chatter: {
		colour: "red",
		icon: <ChatterIcon size={26} />,
		title: "Chatter",
		desc: "Post your thoughts, your updates, share images and audio, and interact with your Friends' own Chatter. We will always collect all the unread Chatter from Friends and display it chronologically.",
	},
};

export function How() {
	const [activeTab, setActiveTab] = useState<TabType>("island");
	const [isCardHovered, setIsCardHovered] = useState(false);

	const activePage = PAGES[activeTab];

	return (
		<section className={styles.howSection}>
			<h2 className={styles.sectionHeadline}>How it works</h2>

			<div className={styles.tabBar}>
				<HowTabBar
					activeTab={activeTab}
					setActiveTab={setActiveTab}
				/>
			</div>

			<div
				key={activeTab}
				className={styles.pageCard}
				data-colour={activePage.colour}
				onMouseEnter={() => setIsCardHovered(true)}
				onMouseLeave={() => setIsCardHovered(false)}>
				<div className={styles.pageIcon}>
					<TactileButton
						colour={activePage.colour}
						isMini={true}
						active={isCardHovered}>
						{activePage.icon}
					</TactileButton>
				</div>
				<div className={styles.pageInfo}>
					<h3 className={styles.pageTitle}>{activePage.title}</h3>
					<p className={styles.pageDesc}>{activePage.desc}</p>
				</div>
			</div>
		</section>
	);
}
