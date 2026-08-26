import styles from "./Guest.module.css";

const VALUES = [
	{ label: "You own your Island", colour: "yellow" },
	{ label: "Creation over consumption", colour: "green" },
	{ label: "Friendship and community", colour: "blue" },
	{ label: "No algorithms", colour: "red" },
] as const;

export function About() {
	return (
		<section
			className={styles.aboutSection}
			id="about">
			<div className={styles.aboutText}>
				<h1 className={styles.pageTitle}>dotworld</h1>
				<h2 className={styles.sectionHeadline}>Your world within the world-wide web</h2>
				<p className={styles.sectionBody}>
					A digital space created and curated by you, away from the algorithmic
					recommendations and the never-ending doomscroll. Express yourself, your hobbies,
					and interests through what you build rather than consume. It's just you, your
					Island, your Trinkets, and the Friends you invite in.
				</p>
			</div>

			<div className={styles.valueGrid}>
				{VALUES.map((value) => (
					<div
						key={value.label}
						className={styles.valueChip}
						data-colour={value.colour}>
						{value.label}
					</div>
				))}
			</div>
		</section>
	);
}
