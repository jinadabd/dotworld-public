import type { IslandVisibility } from "@shared/types";
import styles from "./VisibilityToggle.module.css";

interface Props {
	value: IslandVisibility;
	onChange: (value: IslandVisibility) => void;
}

export function VisibilityToggle({ value, onChange }: Props) {
	return (
		<div
			className={styles.group}
			role="radiogroup"
			aria-label="Island visibility">
			{(["friends", "world"] as const).map((option) => (
				<label
					key={option}
					className={`${styles.option} ${value === option ? styles.selected : ""}`}>
					<input
						type="radio"
						name="island_visibility"
						value={option}
						checked={value === option}
						onChange={() => onChange(option)}
						className={styles.hiddenInput}
					/>
					{option === "friends" ? "Friends" : "Everyone"}
				</label>
			))}
		</div>
	);
}
