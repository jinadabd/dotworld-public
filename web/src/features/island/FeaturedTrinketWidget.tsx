import type { TrinketRow } from "@shared/types";

export function FeaturedTrinketWidget({ trinket }: { trinket: TrinketRow }) {
	return (
		<div>
			<h3>{trinket.title}</h3>
			<p>{trinket.description}</p>
			<img
				src={trinket.cover_url}
				alt=""
			/>
		</div>
	);
}
