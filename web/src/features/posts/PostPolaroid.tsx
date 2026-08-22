import type { PostWithAuthor } from "@shared/types";
import styles from "./Posts.module.css";
import { InteractionBar } from "../../components/buttons/InteractionBar";
import { formatDate } from "../../utils/formatDate";
import { UserBadgeKeycap } from "../../components/buttons/KeycapUserBadge";
import { rotatePost } from "../../utils/rotatePost";

interface PostCardProps {
	postWithAuthor: PostWithAuthor;
}

export function PostPolaroid({ postWithAuthor }: PostCardProps) {
	const { post, author } = postWithAuthor;

	return (
		<div
			className={styles.postCard}
			data-type={post.post_type}
			style={{ "--rotation": `${rotatePost(post.id)}deg` } as React.CSSProperties}>
			<div className={styles.polaroidFrame}>
				{post.media_url && (
					<div className={styles.polaroidWindow}>
						<img
							className={styles.postMedia}
							src={post.media_url}
							alt="Post media"
						/>
					</div>
				)}
				<p className={styles.postBody}>{post.body_text || ""}</p>
			</div>

			<div className={styles.postInfo}>
				<div className={styles.postDetails}>
					<div className={styles.userBadge}>
						<UserBadgeKeycap
							user={author}
							mode="column"
						/>
					</div>

					<time className={styles.timestamp}>{formatDate(post.created_at)}</time>
				</div>

				<div className={styles.interactionBar}>
					<InteractionBar />
				</div>
			</div>
		</div>
	);
}
