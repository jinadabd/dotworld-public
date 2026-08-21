import type { PostWithAuthor } from "@shared/types";
import { UserBadge } from "../../components/badges/UserBadge";
import styles from "./Posts.module.css";
import { InteractionBar } from "../../components/buttons/InteractionBar";
import { formatDate } from "../../utils/formatDate";

interface PostCardProps {
	postWithAuthor: PostWithAuthor;
}

export function PostCard({ postWithAuthor }: PostCardProps) {
	const { post, author } = postWithAuthor;

	return (
		<div
			className={styles.postCard}
			data-type={post.post_type}>
			<UserBadge
				user={author}
				style={styles}></UserBadge>

			<div className={styles.postContent}>
				{post.body_text && <p className={styles.postBody}>{post.body_text}</p>}
				{post.media_url && (
					<img
						className={styles.postMedia}
						src={post.media_url}
						alt="Post media"
					/>
				)}
			</div>

			<div className={styles.postFooter}>
				<time className={styles.timetamp}>{formatDate(post.created_at)}</time>
				<div className={styles.interactionBar}>
					<InteractionBar />
				</div>
			</div>
		</div>
	);
}
