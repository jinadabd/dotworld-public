import { KeyboardLayout, type KeyPosition } from "./KeyboardLayout";
import type { PaginatedPosts } from "@shared/types";

interface Props {
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	posts: PaginatedPosts;
}

export function PaginationBar({ page, setPage, posts }: Props) {
	const interactionKeys: KeyPosition[] = [
		{
			id: "prevButton",
			col: 1,
			row: 1,
			colSpan: 1,
			keycapProps: {
				colour: "red",
				disabled: page === 1,
				onRelease: () => setPage((prev) => Math.max(prev - 1, 1)),
				children: "<",
			},
		},
		{
			id: "currentPage",
			col: 2,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "red",
				onRelease: () => setPage(1),
				children: `${page} of ${posts.pagination.totalPages}`,
			},
		},
		{
			id: "nextButton",
			col: 4,
			row: 1,
			colSpan: 1,
			keycapProps: {
				colour: "red",
				disabled: !posts.pagination.hasMore,
				onRelease: () => setPage((prev) => prev + 1),
				children: ">",
			},
		},
	];

	return (
		<KeyboardLayout
			keys={interactionKeys}
			columns={3}
			rows={1}
			plateColor="var(--dark)"
		/>
	);
}
