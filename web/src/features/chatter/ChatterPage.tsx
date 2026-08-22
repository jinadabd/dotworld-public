import { useState } from "react";
import { useGetChatterQuery } from "../posts/postsApi";
import { PostCard } from "../posts/PostCard"; // Replace with your Post component
import { useSetSidebar } from "../../hooks/useSetSidebar";
import { ComposeWidget } from "../widgets/ComposeWidget";
import { ChatterTabBar } from "./ChatterTabBar";
import { PaginationBar } from "../../components/buttons/PaginationBar";
import { PostPolaroid } from "../posts/PostPolaroid";

import pageStyles from "../../styles/MainPage.module.css";
import postStyles from "../posts/Posts.module.css";

const LOCAL_STORAGE_KEY = "chatter_last_read_time";

export function ChatterPage() {
	useSetSidebar(<ComposeWidget />);

	const [page, setPage] = useState(1);
	const [activeTab, setActiveTab] = useState<"unread" | "read" | "all">("unread");

	const [lastReadTime, setLastReadTime] = useState<string>(() => {
		return localStorage.getItem(LOCAL_STORAGE_KEY) || new Date(0).toISOString();
	});

	const { data, isLoading, error } = useGetChatterQuery({ page, limit: 10 });

	const markAsRead = () => {
		const now = new Date().toISOString();
		localStorage.setItem(LOCAL_STORAGE_KEY, now);
		setLastReadTime(now);
	};

	if (isLoading)
		return (
			<div className={pageStyles.pageContainer}>
				<div className={pageStyles.pageHeader}>
					<h1 className={pageStyles.pageTitle}>Chatter</h1>
					<ChatterTabBar
						className={pageStyles.viewBar}
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						markAsRead={markAsRead}
					/>
				</div>

				<div className={pageStyles.pageMain}>
					<p className={pageStyles.statusMessage}>Loading chatter feed...</p>
				</div>
			</div>
		);

	if (error || !data)
		return (
			<div className={pageStyles.pageContainer}>
				<div className={pageStyles.pageHeader}>
					<h1 className={pageStyles.pageTitle}>Chatter</h1>
					<ChatterTabBar
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						markAsRead={markAsRead}
					/>
				</div>

				<div className={pageStyles.pageMain}>
					<p className={pageStyles.statusMessage}>Failed to load Chatter.</p>
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
				<ChatterTabBar
					className={pageStyles.viewBar}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					markAsRead={markAsRead}
				/>
			</div>

			<div className={pageStyles.pageMain}>
				{isLoading ? (
					<p className={pageStyles.statusMessage}>Loading chatter feed...</p>
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
