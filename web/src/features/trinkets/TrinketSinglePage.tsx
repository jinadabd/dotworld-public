import { useParams } from "react-router-dom";
import { useGetTrinketQuery } from "./trinketApi";
import { CreateTrinketItemForm } from "./CreateTrinketItemForm";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

export function TrinketSinglePage() {
	const { trinketId: trinketParam } = useParams<{ trinketId: string }>();
	const trinketId = Number(trinketParam);

	const { data, isLoading, error } = useGetTrinketQuery(
		{ trinketId: trinketId },
		{ skip: !trinketId },
	);

	const { id: myId } = useSelector((state: RootState) => state.auth.user!);

	if (isLoading) return <p>Loading trinket...</p>;
	if (error || !data) return <p>Trinket not found.</p>;

	const { trinket, trinketItems } = data;
	const isOwnTrinket = trinket.user_id === myId;

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
			{isOwnTrinket && (
				<CreateTrinketItemForm
					trinket={trinket}
					nextOrder={trinketItems.length + 1}
				/>
			)}
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
