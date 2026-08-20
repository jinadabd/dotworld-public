import { useState } from "react";
import { useGetUserTrinketsQuery } from "./trinketApi";
import { TrinketCard } from "./TrinketCard";
import { CreateTrinketForm } from "./CreateTrinketForm";
import { TactileButton } from "../../components/buttons/TactileButton";
import styles from "./Trinkets.module.css";

interface Props {
	username: string;
	isOwnIsland?: boolean;
}

export function UserTrinkets({ username, isOwnIsland = false }: Props) {
	const [isCreating, setIsCreating] = useState(false);
	const { data: trinkets, isLoading, error } = useGetUserTrinketsQuery({ username });

	if (isCreating) {
		return (
			<CreateTrinketForm
				onSuccess={() => setIsCreating(false)}
				onCancel={() => setIsCreating(false)}
			/>
		);
	}

	return (
		<div className={styles.trinketsView}>
			<div className={styles.headerRow}>
				<h2 className={styles.sectionTitle}>
					{isOwnIsland ? "My Trinkets" : `${username}'s Trinkets`}
				</h2>
				{isOwnIsland && (
					<TactileButton onClick={() => setIsCreating(true)}>Add Trinket</TactileButton>
				)}
			</div>

			{isLoading ? (
				<p>Loading trinkets...</p>
			) : error || !trinkets || trinkets.length === 0 ? (
				<p>No trinkets found.</p>
			) : (
				<div className={styles.trinketGrid}>
					{trinkets.map((trinket) => (
						<div
							className={styles.trinketCard}
							key={trinket.id}>
							<TrinketCard trinket={trinket} />
						</div>
					))}
				</div>
			)}
		</div>
	);
}
