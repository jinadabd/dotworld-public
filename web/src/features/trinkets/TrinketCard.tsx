import { Link } from "react-router-dom";
import type { TrinketRow } from "@shared/types";

export function TrinketCard({ trinket }: { trinket: TrinketRow }) {
	return (
		<Link to={`/trinkets/${trinket.id}`}>
			{trinket.cover_url && (
				<img
					src={trinket.cover_url}
					alt={trinket.title}
				/>
			)}
			<h3>{trinket.title}</h3>
			{trinket.description && <p>{trinket.description}</p>}
			{/* <span>{trinket.trinket_type}</span> */}
			{/* <span>{trinket.trinket_visibility}</span> */}
		</Link>
	);
}
