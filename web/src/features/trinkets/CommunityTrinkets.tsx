import type { TrinketType } from "@shared/types";
import { useGetCommunityTrinketsQuery } from "./trinketApi";
import { TrinketCard } from "./TrinketCard";

import trinketStyles from "./Trinkets.module.css";

interface Props {
	filter: TrinketType | "all";
}

export function CommunityTrinkets({ filter }: Props) {
	const { data: trinkets, isLoading, error } = useGetCommunityTrinketsQuery();

	if (isLoading) return <p>Loading Community Trinkets...</p>;
	if (error || !trinkets) return <p>Failed to load Trinkets.</p>;

	const filteredTrinkets =
		filter === "all" ? trinkets : trinkets.filter((trinket) => trinket.trinket_type === filter);

	return (
		<>
			{isLoading ? (
				<p>Loading Community Trinkets...</p>
			) : error || !filteredTrinkets || filteredTrinkets.length === 0 ? (
				<p>{`No Community Trinkets found :'( Why not be the first?`}</p>
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
