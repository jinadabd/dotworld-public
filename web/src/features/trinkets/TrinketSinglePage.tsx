import { useParams } from "react-router-dom";
import { useGetTrinketQuery } from "./trinketApi";

export function TrinketSinglePage() {
	const { trinketId } = useParams<{ trinketId: string }>();
	const id = Number(trinketId);

	const { data, isLoading, error } = useGetTrinketQuery({ trinketId: id }, { skip: !id });

	if (isLoading) return <p>Loading trinket...</p>;
	if (error || !data) return <p>Trinket not found.</p>;

	const { trinket, trinketItems } = data;

	return (
		<div>
			{trinket.cover_url && (
				<img
					src={trinket.cover_url}
					alt={trinket.title}
				/>
			)}
			<h1>{trinket.title}</h1>
			{trinket.description && <p>{trinket.description}</p>}
			<p>Type: {trinket.trinket_type}</p>
			{/* <p>Visibility: {trinket.trinket_visibility}</p> */}

			<h2>Items ({trinketItems.length})</h2>
			{trinketItems.length === 0 ? (
				<p>No items in this trinket yet.</p>
			) : (
				<ul>
					{trinketItems.map((item) => (
						<li key={item.id}>
							<h4>{item.title ?? `Item #${item.item_order}`}</h4>
							{item.description && <p>{item.description}</p>}
							{item.media_url && (
								<a
									href={item.media_url}
									target="_blank"
									rel="noreferrer">
									View Media
								</a>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
