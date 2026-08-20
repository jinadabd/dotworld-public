import type { PostRow, PostWithAuthor, PublicUser } from "@shared/types";
import { UserBadge } from "../../components/badges/UserBadge";
import styles from "./Posts.module.css";

interface PostCardProps {
	postWithAuthor: PostWithAuthor;
}

export function PostCard({ postWithAuthor }: PostCardProps) {
	const { post, author } = postWithAuthor;

	return (
		<div className={styles.postCard}>
			{/* Author Header */}
			<UserBadge user={author}>
				<time>{new Date(post.created_at).toLocaleDateString()}</time>
			</UserBadge>

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
