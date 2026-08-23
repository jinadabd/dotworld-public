import { useState } from "react";
import { useGetUserPostsQuery } from "./postsApi";
import { ComposePostForm } from "./ComposePostForm";
import { PostCard } from "./PostCard";
import { PaginationBar } from "../../components/buttons/PaginationBar";
import { PostPolaroid } from "./PostPolaroid";
import { useComposePost } from "../../hooks/useComposePost";
import { ComposeToolbar } from "./ComposeToolbar";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

import postStyles from "./Posts.module.css";

interface Props {
	username: string;
}

export function UserPosts({ username }: Props) {
	const [page, setPage] = useState(1);

	const { username: myUsername } = useSelector((state: RootState) => state.auth.user!);
	const isOwnIsland = username === myUsername;

	const [isComposing, setIsComposing] = useState(false);
	const compose = useComposePost();

	async function handleSubmit() {
		const success = await compose.submit();
		if (success) setIsComposing(false);
	}

	const { data, isLoading, error } = useGetUserPostsQuery({ username, page, limit: 25 });

	if (isLoading) return <p>Loading psots...</p>;
	if (error || !data) return <p>Failed to load posts.</p>;

	const { posts, pagination } = data;

	return (
		<>
			<div className={postStyles.headerRow}>
				<h2 className={postStyles.sectionTitle}>
					{isOwnIsland ? "My Posts" : `${username}'s Posts`}
				</h2>
				{isOwnIsland && (
					<ComposeToolbar
						isComposing={isComposing}
						onToggleCompose={() => setIsComposing((prev) => !prev)}
						onSubmit={handleSubmit}
						hasContent={compose.hasContent}
						isBusy={compose.isBusy}
					/>
				)}
			</div>

			<div
				className={postStyles.composeDrawer}
				data-expanded={isComposing}>
				<div className={postStyles.drawerInner}>
					<ComposePostForm compose={compose} />
				</div>
			</div>

			{isLoading ? (
				<p>Loading {username}'s posts...</p>
			) : error || !posts || posts.length === 0 ? (
				<p>No posts found.</p>
			) : (
				<div className={postStyles.postView}>
					{posts.map((postWithAuthor) =>
						postWithAuthor.post.post_type === "text" ? (
							<PostCard
								key={postWithAuthor.post.id}
								postWithAuthor={postWithAuthor}
							/>
						) : (
							<PostPolaroid
								key={postWithAuthor.post.id}
								postWithAuthor={postWithAuthor}
							/>
						),
					)}

					<PaginationBar
						page={page}
						setPage={setPage}
						posts={{ posts, pagination }}
					/>
				</div>
			)}
		</>
	);
}
