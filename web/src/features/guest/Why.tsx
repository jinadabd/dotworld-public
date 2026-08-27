import styles from "./Guest.module.css";

const PROBLEMS = [
	"Interests are scattered over various apps and websites.",
	"Social media is too algorithmic and rewards inauthenticity.",
	"Nothing you create online is truly yours.",
	"Digital presence is utilized to sell products instead of create space for connection.",
];

export function Why() {
	return (
		<section className={styles.whySection}>
			<h2 className={styles.sectionHeadline}>Why dotworld?</h2>

			<div className={styles.cardBoard}>
				{PROBLEMS.map((problem, i) => (
					<div
						key={problem}
						className={styles.indexCard}>
						<p>{problem}</p>
					</div>
				))}
			</div>
		</section>
	);
}
