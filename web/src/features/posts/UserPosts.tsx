import { useState } from "react";
import { TactileButton } from "../../components/buttons/TactileButton";
import { useGetUserPostsQuery } from "./postsApi";
import { ComposePostForm } from "./ComposePostForm";
import { PostCard } from "./PostCard";
import styles from "./Posts.module.css";

interface Props {
	username: string;
	isOwnIsland?: boolean;
}

export function UserPosts({ username, isOwnIsland = false }: Props) {
	const [page, setPage] = useState(1);

	const [isComposing, setIsComposing] = useState(false);
	const { data, isLoading, error } = useGetUserPostsQuery({ username, page, limit: 25 });

	if (isComposing) {
		return (
			<ComposePostForm
				onSuccess={() => setIsComposing(false)}
				onCancel={() => setIsComposing(false)}
			/>
		);
	}

	if (isLoading) return <p>Loading psots...</p>;
	if (error || !data) return <p>Failed to load posts.</p>;

	const { posts, pagination } = data;

	return (
		<div>
			<div>
				<h2>{isOwnIsland ? "My Posts" : `${username}'s Posts`}</h2>
				{isComposing ? (
					<ComposePostForm
						onSuccess={() => setIsComposing(false)}
						onCancel={() => setIsComposing(false)}
					/>
				) : (
					isOwnIsland && (
						<TactileButton onClick={() => setIsComposing(true)}>Compose</TactileButton>
					)
				)}
			</div>

			{isLoading ? (
				<p>Loading {username}'s posts...</p>
			) : error || !posts || posts.length === 0 ? (
				<p>No posts found.</p>
			) : (
				<div className={styles.postView}>
					{posts.map((postWithAuthor) => (
						<PostCard
							key={postWithAuthor.post.id}
							postWithAuthor={postWithAuthor}
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
