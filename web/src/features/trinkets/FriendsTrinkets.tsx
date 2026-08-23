import { useState } from "react";
import { useGetFriendsTrinketsQuery } from "./trinketApi";
import { TrinketCard } from "./TrinketCard";
import type { TrinketType } from "@shared/types";

import trinketStyles from "./Trinkets.module.css";

interface Props {
	filter: TrinketType | "all";
}

export function FriendsTrinkets({ filter }: Props) {
	const [page, setPage] = useState(1);

	const { data: trinkets, isLoading, error } = useGetFriendsTrinketsQuery({ page, limit: 21 });

	if (isLoading) return <p>Loading friends' Trinkets...</p>;
	if (error || !trinkets) return <p>Failed to load Trinkets.</p>;

	const filteredTrinkets =
		filter === "all" ? trinkets : trinkets.filter((trinket) => trinket.trinket_type === filter);

	return (
		<>
			<div className={trinketStyles.headerRow}>
				<h2 className={trinketStyles.sectionTitle}>Friends' Trinkets</h2>
			</div>

			{isLoading ? (
				<p>Loading friends' trinkets...</p>
			) : error || !filteredTrinkets || filteredTrinkets.length === 0 ? (
				<p>{`No trinkets found from friends. :(`}</p>
			) : (
				<div className={trinketStyles.trinketView}>
					{filteredTrinkets.map((trinket) => (
						<TrinketCard
							key={trinket.id}
							trinket={trinket}
							author={trinket.user}
						/>
					))}
				</div>
			)}
		</>
	);
}
