import { useParams } from "react-router-dom";
import { useGetTrinketQuery } from "./trinketApi";
import { Collection } from "./trinketPages/Collection";
import { Gallery } from "./trinketPages/Gallery";
import { Player } from "./trinketPages/Player";

export function TrinketSinglePage() {
	const { trinketId: trinketParam } = useParams<{ trinketId: string }>();
	const trinketId = Number(trinketParam);

	const { data, isLoading, error } = useGetTrinketQuery(
		{ trinketId: trinketId },
		{ skip: !trinketId },
	);

	if (isLoading) return <p>Loading trinket...</p>;
	if (error || !data) return <p>Trinket not found.</p>;

	const { trinket } = data;

	return trinket.trinket_type === "collection" ? (
		<Collection />
	) : trinket.trinket_type === "gallery" ? (
		<Gallery />
	) : (
		<Player />
	);
}
