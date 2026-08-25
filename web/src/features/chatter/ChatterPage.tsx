import { useState } from "react";
import { useGetChatterQuery } from "../posts/postsApi";
import { PostCard } from "../posts/PostCard"; // Replace with your Post component
import { useSetSidebar } from "../../hooks/useSetSidebar";
import { ChatterTabBar } from "./ChatterTabBar";
import { PaginationBar } from "../../components/buttons/PaginationBar";
import { PostPolaroid } from "../posts/PostPolaroid";

import pageStyles from "../../styles/MainPage.module.css";
import postStyles from "../posts/Posts.module.css";
import { useComposePost } from "../../hooks/useComposePost";
import { ComposeToolbar } from "../posts/ComposeToolbar";
import { ComposePostForm } from "../posts/ComposePostForm";
import { MarkAsReadWidget } from "../widgets/MarkAsReadWidget";

const LOCAL_STORAGE_KEY = "chatter_last_read_time";

export function ChatterPage() {
	const [page, setPage] = useState(1);
	const [activeTab, setActiveTab] = useState<"unread" | "read">("unread");

	const [lastReadTime, setLastReadTime] = useState<string>(() => {
		return localStorage.getItem(LOCAL_STORAGE_KEY) || new Date(0).toISOString();
	});

	const [isComposing, setIsComposing] = useState(false);
	const compose = useComposePost();

	async function handleSubmit() {
		const success = await compose.submit();
		if (success) setIsComposing(false);
	}

	const { data, isLoading, error } = useGetChatterQuery({ page, limit: 10 });

	const markAsRead = () => {
		const now = new Date().toISOString();
		localStorage.setItem(LOCAL_STORAGE_KEY, now);
		setLastReadTime(now);
	};

	useSetSidebar(<MarkAsReadWidget markAsRead={markAsRead} />);

	if (isLoading)
		return (
			<div className={pageStyles.pageContainer}>
				<div className={pageStyles.pageHeader}>
					<h1 className={pageStyles.pageTitle}>Chatter</h1>
					<div className={pageStyles.viewBar}>
						<ChatterTabBar
							activeTab={activeTab}
							setActiveTab={setActiveTab}
						/>
					</div>
				</div>

				<div className={pageStyles.pageMain}>
					<div className={postStyles.headerRow}>
						<h2 className={postStyles.sectionTitle}>Compose</h2>
						<ComposeToolbar
							isComposing={isComposing}
							onToggleCompose={() => setIsComposing((prev) => !prev)}
							onSubmit={handleSubmit}
							hasContent={compose.hasContent}
							isBusy={compose.isBusy}
						/>
					</div>
					<p className={pageStyles.statusMessage}>Loading Friends' Chatter...</p>
				</div>

				<div
					className={postStyles.composeDrawer}
					data-expanded={isComposing}>
					<div className={postStyles.drawerInner}>
						<ComposePostForm compose={compose} />
					</div>
				</div>
			</div>
		);

	if (error || !data)
		return (
			<div className={pageStyles.pageContainer}>
				<div className={pageStyles.pageHeader}>
					<h1 className={pageStyles.pageTitle}>Chatter</h1>
					<div className={pageStyles.viewBar}>
						<ChatterTabBar
							activeTab={activeTab}
							setActiveTab={setActiveTab}
						/>
					</div>
				</div>

				<div className={pageStyles.pageMain}>
					<div className={postStyles.headerRow}>
						<h2 className={postStyles.sectionTitle}>Compose</h2>
						<ComposeToolbar
							isComposing={isComposing}
							onToggleCompose={() => setIsComposing((prev) => !prev)}
							onSubmit={handleSubmit}
							hasContent={compose.hasContent}
							isBusy={compose.isBusy}
						/>
					</div>
					<p className={pageStyles.statusMessage}>Failed to load Chatter.</p>
				</div>

				<div
					className={postStyles.composeDrawer}
					data-expanded={isComposing}>
					<div className={postStyles.drawerInner}>
						<ComposePostForm compose={compose} />
					</div>
				</div>
			</div>
		);

	const { posts, pagination } = data;

	// Categorize posts based on the last read timestamp
	const filteredPosts = posts.filter(({ post }) => {
		const postTime = new Date(post.created_at).toISOString();
		if (activeTab === "unread") return postTime > lastReadTime;
		if (activeTab === "read") return postTime <= lastReadTime;
		return true;
	});

	return (
		<div className={pageStyles.pageContainer}>
			<div className={pageStyles.pageHeader}>
				<h1 className={pageStyles.pageTitle}>Chatter</h1>
				<div className={pageStyles.viewBar}>
					<ChatterTabBar
						activeTab={activeTab}
						setActiveTab={setActiveTab}
					/>
				</div>
			</div>

			<div className={pageStyles.pageMain}>
				<div className={postStyles.headerRow}>
					<h2 className={postStyles.sectionTitle}>Compose</h2>
					<ComposeToolbar
						isComposing={isComposing}
						onToggleCompose={() => setIsComposing((prev) => !prev)}
						onSubmit={handleSubmit}
						hasContent={compose.hasContent}
						isBusy={compose.isBusy}
					/>
				</div>

				<div
					className={postStyles.composeDrawer}
					data-expanded={isComposing}>
					<div className={postStyles.drawerInner}>
						<ComposePostForm compose={compose} />
					</div>
				</div>

				{isLoading ? (
					<p className={pageStyles.statusMessage}>Loading Friends' Chatter...</p>
				) : error || !data ? (
					<p className={pageStyles.statusMessage}>Failed to load Chatter.</p>
				) : filteredPosts.length === 0 ? (
					<p className={pageStyles.statusMessage}>No posts to display in this view.</p>
				) : (
					<div className={postStyles.postView}>
						{filteredPosts.map((postWithAuthor) =>
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
						{filteredPosts.length > 1 && (
							<div className={postStyles.paginationBar}>
								<PaginationBar
									page={page}
									setPage={setPage}
									posts={{ posts, pagination }}
								/>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
