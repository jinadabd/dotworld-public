import { useState } from "react";
import { useGetChatterQuery } from "../posts/postsApi";
import { PostCard } from "../posts/PostCard"; // Replace with your Post component
import { useSetSidebar } from "../../hooks/useSetSidebar";
import { ComposeWidget } from "../widgets/ComposeWidget";
import styles from "./Chatter.module.css";
import { ChatterTabBar } from "./ChatterTabBar";

const LOCAL_STORAGE_KEY = "chatter_last_read_time";

export function ChatterPage() {
	useSetSidebar(<ComposeWidget />);

	const [page, setPage] = useState(1);
	const [activeTab, setActiveTab] = useState<"unread" | "read" | "all">("unread");

	const [lastReadTime, setLastReadTime] = useState<string>(() => {
		return localStorage.getItem(LOCAL_STORAGE_KEY) || new Date(0).toISOString();
	});

	const { data, isLoading, error } = useGetChatterQuery({ page, limit: 25 });

	const markAsRead = () => {
		const now = new Date().toISOString();
		localStorage.setItem(LOCAL_STORAGE_KEY, now);
		setLastReadTime(now);
	};

	if (isLoading) return <p>Loading chatter feed...</p>;
	if (error || !data) return <p>Failed to load feed.</p>;

	const { posts, pagination } = data;

	// Categorize posts based on the last read timestamp
	const filteredPosts = posts.filter(({ post }) => {
		const postTime = new Date(post.created_at).toISOString();
		if (activeTab === "unread") return postTime > lastReadTime;
		if (activeTab === "read") return postTime <= lastReadTime;
		return true;
	});

	return (
		<div className={styles.pageContainer}>
			<h1>Chatter</h1>

			<ChatterTabBar
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				markAsRead={markAsRead}
			/>

			{filteredPosts.length === 0 ? (
				<div className={styles.postView}>No posts to display in this view.</div>
			) : (
				<div className={styles.postView}>
					{filteredPosts.map((postWithAuthor) => (
						<PostCard
							key={postWithAuthor.post.id}
							postWithAuthor={postWithAuthor}
						/>
					))}
				</div>
			)}
		</div>
	);
}
