import { useGetCommunityTrinketsQuery } from "./trinketApi";
import { TrinketCard } from "./TrinketCard";

export function CommunityTrinkets() {
	const { data: trinkets, isLoading, error } = useGetCommunityTrinketsQuery();

	return (
		<div>
			<h2>Community Trinkets</h2>

			{isLoading ? (
				<p>Loading community trinkets...</p>
			) : error || !trinkets || trinkets.length === 0 ? (
				<p>No community trinkets found.</p>
			) : (
				<div>
					{trinkets.map((trinket) => (
						<TrinketCard
							key={trinket.id}
							trinket={trinket}
						/>
					))}
				</div>
			)}
		</div>
	);
}
