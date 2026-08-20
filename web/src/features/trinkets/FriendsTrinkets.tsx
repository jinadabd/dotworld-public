import { useState } from "react";
import { useGetFriendsTrinketsQuery } from "./trinketApi";
import { TrinketCard } from "./TrinketCard";

export function FriendsTrinkets() {
	const [page, setPage] = useState(1);

	const { data, isLoading, error } = useGetFriendsTrinketsQuery({ page, limit: 21 });

	if (isLoading) return <p>Loading chatter feed...</p>;
	if (error || !data) return <p>Failed to load feed.</p>;

	const { trinkets, pagination } = data;

	return (
		<div>
			<h2>Friends' Trinkets</h2>

			{isLoading ? (
				<p>Loading friends' trinkets...</p>
			) : error || !trinkets || trinkets.length === 0 ? (
				<p>No trinkets found from friends.</p>
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

			<div>
				<button
					disabled={page === 1}
					onClick={() => {
						setPage((prev) => Math.max(prev - 1, 1));
					}}>
					&laquo; Previous
				</button>

				{Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
					<button
						key={pageNum}
						onClick={() => {
							setPage(pageNum);
						}}
						disabled={pageNum === page}>
						{pageNum}
					</button>
				))}

				<button
					disabled={!pagination.hasMore}
					onClick={() => {
						setPage((prev) => prev + 1);
					}}>
					Next &raquo;
				</button>
			</div>
		</div>
	);
}
