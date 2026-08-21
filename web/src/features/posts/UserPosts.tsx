import { useState } from "react";
import { TactileButton } from "../../components/buttons/TactileButton";
import { useGetUserPostsQuery } from "./postsApi";
import { ComposePostForm } from "./ComposePostForm";
import { PostCard } from "./PostCard";
import postStyles from "./Posts.module.css";
import { PaginationBar } from "../../components/buttons/PaginationBar";

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
		<div className={postStyles.pageContainer}>
			<div className={postStyles.headerRow}>
				<h2 className={postStyles.sectionTitle}>
					{isOwnIsland ? "My Posts" : `${username}'s Posts`}
				</h2>
				{isComposing ? (
					<ComposePostForm
						onSuccess={() => setIsComposing(false)}
						onCancel={() => setIsComposing(false)}
					/>
				) : (
					isOwnIsland && (
						<TactileButton onPress={() => setIsComposing(true)}>Compose</TactileButton>
					)
				)}
			</div>

			{isLoading ? (
				<p>Loading {username}'s posts...</p>
			) : error || !posts || posts.length === 0 ? (
				<p>No posts found.</p>
			) : (
				<div className={postStyles.postView}>
					{posts.map((postWithAuthor) => (
						<PostCard
							key={postWithAuthor.post.id}
							postWithAuthor={postWithAuthor}
						/>
					))}
				</div>
			)}

			<PaginationBar
				page={page}
				setPage={setPage}
				posts={{ posts, pagination }}
			/>
		</div>
	);
}
