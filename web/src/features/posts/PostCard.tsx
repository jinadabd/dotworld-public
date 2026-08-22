import type { PostWithAuthor } from "@shared/types";
import { UserBadge } from "../../components/badges/UserBadge";
import styles from "./Posts.module.css";
import { InteractionBar } from "../../components/buttons/InteractionBar";
import { formatDate } from "../../utils/formatDate";
import { UserBadgeKeycap } from "../../components/buttons/KeycapUserBadge";

interface PostCardProps {
	postWithAuthor: PostWithAuthor;
}

export function PostCard({ postWithAuthor }: PostCardProps) {
	const { post, author } = postWithAuthor;

	return (
		<div
			className={styles.postCard}
			data-type={post.post_type}>
			<div className={styles.postDetails}>
				<div className={styles.userBadge}>
					<UserBadgeKeycap
						user={author}
						mode="row"
					/>
				</div>

				<time className={styles.timestamp}>{formatDate(post.created_at)}</time>
			</div>

			<div className={styles.postContent}>
				{post.media_url && (
					<img
						className={styles.postMedia}
						src={post.media_url}
						alt="Post media"
					/>
				)}
				{post.body_text && <p className={styles.postBody}>{post.body_text}</p>}
			</div>

			<div className={styles.postFooter}>
				<div className={styles.interactionBar}>
					<InteractionBar />
				</div>
			</div>
		</div>
	);
}
