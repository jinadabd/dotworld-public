import { useState } from "react";
import { useGetChatterFeedQuery } from "../posts/postsApi";
import { PostCard } from "../posts/PostCard"; // Replace with your Post component

const LOCAL_STORAGE_KEY = "chatter_last_read_time";

export function ChatterPage() {
	const [page, setPage] = useState(1);
	const [activeTab, setActiveTab] = useState<"unread" | "read" | "all">("all");

	// Store/retrieving the timestamp threshold for read status
	const [lastReadTime, setLastReadTime] = useState<string>(() => {
		return localStorage.getItem(LOCAL_STORAGE_KEY) || new Date(0).toISOString();
	});

	const { data, isLoading, error } = useGetChatterFeedQuery({ page, limit: 25 });

	// Mark current feed items as read when switching pages or unmounting
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
		<div>
			<h1>Chatter</h1>

			{/* Read / Unread Tabs */}
			<div>
				<button
					onClick={() => setActiveTab("all")}
					disabled={activeTab === "all"}>
					All
				</button>
				<button
					onClick={() => setActiveTab("unread")}
					disabled={activeTab === "unread"}>
					Unread
				</button>
				<button
					onClick={() => setActiveTab("read")}
					disabled={activeTab === "read"}>
					Read
				</button>
				<button onClick={markAsRead}>Mark All as Read</button>
			</div>

			{/* Posts List */}
			{filteredPosts.length === 0 ? (
				<p>No posts to display in this view.</p>
			) : (
				<div>
					{filteredPosts.map(({ post }) => (
						<PostCard
							key={post.id}
							post={post}
						/>
					))}
				</div>
			)}

			{/* Google-Style Numeric Pagination Controls */}
			<div>
				<button
					disabled={page === 1}
					onClick={() => {
						markAsRead();
						setPage((prev) => Math.max(prev - 1, 1));
					}}>
					&laquo; Previous
				</button>

				{Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
					<button
						key={pageNum}
						onClick={() => {
							markAsRead();
							setPage(pageNum);
						}}
						disabled={pageNum === page}>
						{pageNum}
					</button>
				))}

				<button
					disabled={!pagination.hasMore}
					onClick={() => {
						markAsRead();
						setPage((prev) => prev + 1);
					}}>
					Next &raquo;
				</button>
			</div>
		</div>
	);
}
