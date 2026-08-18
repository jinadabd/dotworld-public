import type { PostRow, PublicUser } from "@shared/types";
import { FetchedUserBadge } from "../users/FetchedUserBadge";

interface PostCardProps {
	post: PostRow;
}

export function PostCard({ post }: PostCardProps) {
	return (
		<div className="post-card">
			{/* Author Header */}
			<FetchedUserBadge userId={post.user_id}>
				<time>{new Date(post.created_at).toLocaleDateString()}</time>
			</FetchedUserBadge>

			{/* Post Content */}
			{post.body_text && <p>{post.body_text}</p>}
			{post.media_url && (
				<img
					src={post.media_url}
					alt="Post media"
				/>
			)}
		</div>
	);
}
