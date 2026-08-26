import { useState } from "react";
import type { PostWithAuthor, EditPostInput } from "@shared/types";
import { EditPostOptions } from "@shared/types";
import styles from "./Posts.module.css";
import { InteractionBar } from "../../components/buttons/InteractionBar";
import { UserBadgeKeycap } from "../../components/buttons/KeycapUserBadge";
import { rotatePost } from "../../utils/rotatePost";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useDeletePostMutation, useEditPostMutation } from "../posts/postsApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { EditPostToolbar } from "./EditPostToolbar";
import { TactileButtonWithConfirm } from "../../components/buttons/TactileButtonWithConfirm";

interface PostCardProps {
	postWithAuthor: PostWithAuthor;
}

function formatPolaroidDate(dateString: string) {
	const d = new Date(dateString);
	if (isNaN(d.getTime())) return "";

	const day = String(d.getDate()).padStart(2, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const year = d.getFullYear();
	const hours = String(d.getHours()).padStart(2, "0");
	const minutes = String(d.getMinutes()).padStart(2, "0");

	return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function PostPolaroid({ postWithAuthor }: PostCardProps) {
	const { post, author } = postWithAuthor;
	const isMobile = useMediaQuery("(max-width: 768px)");

	const [isEditing, setIsEditing] = useState(false);
	const [bodyText, setBodyText] = useState(post.body_text || "");
	const [editPost, { isLoading }] = useEditPostMutation();
	const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

	const currentUser = useSelector((state: RootState) => state.auth.user);
	const isOwner = currentUser?.id === author.id;

	const originalText = post.body_text || "";
	const hasBeenEdited = bodyText.trim() !== originalText.trim();
	const isEmpty = bodyText.trim() === "";

	async function handleSave() {
		if (!hasBeenEdited || isEmpty) return;

		const payload: EditPostInput = {
			post_id: post.id,
			edit_options: [EditPostOptions.edit_body_text],
			body_text: bodyText,
		};

		try {
			await editPost({ postId: post.id, body: payload }).unwrap();
			setIsEditing(false);
		} catch (err) {
			console.error("Failed to edit post:", err);
		}
	}

	function handleToggleEdit() {
		if (isEditing) {
			setBodyText(post.body_text || "");
		}
		setIsEditing((prev) => !prev);
	}

	return isMobile ? (
		<div
			className={styles.postCard}
			data-type={post.post_type}
			data-editing={isEditing}>
			<div className={styles.postDetails}>
				<div className={styles.userBadge}>
					<UserBadgeKeycap
						user={author}
						mode="row"
					/>
				</div>
			</div>
			<div className={styles.polaroidFrame}>
				{post.media_url && (
					<div className={styles.polaroidWindow}>
						<img
							className={styles.postMedia}
							src={post.media_url}
							alt="Post media"
						/>
						<time className={styles.timestamp}>
							{formatPolaroidDate(post.created_at.toString())}
						</time>
					</div>
				)}
				{isEditing ? (
					<textarea
						className={styles.textArea}
						value={bodyText}
						onChange={(e) => setBodyText(e.target.value)}
						disabled={isLoading}
						autoFocus
					/>
				) : (
					<p className={styles.postBody}>{post.body_text || ""}</p>
				)}
			</div>
			<div className={styles.postFooter}>
				<div
					className={styles.footerLeft}
					data-editing={isEditing}>
					<TactileButtonWithConfirm
						colour="red"
						disabled={isDeleting}
						onRelease={() => deletePost({ postId: post.id })}
						resetTrigger={isEditing}
						isMini={true}>
						{isDeleting ? "..." : "Del"}
					</TactileButtonWithConfirm>
				</div>
				<div className={styles.footerRight}>
					{isOwner && (
						<EditPostToolbar
							isEditing={isEditing}
							onToggleEdit={handleToggleEdit}
							onSave={handleSave}
							isBusy={isLoading}
							isEmpty={isEmpty}
							hasBeenEdited={hasBeenEdited}
							isMini={true}
						/>
					)}
					<div className={styles.interactionBar}>
						<InteractionBar disabled={isEditing} />
					</div>
				</div>
			</div>
		</div>
	) : (
		<div
			className={styles.postCard}
			data-type={post.post_type}
			data-editing={isEditing}
			style={{ "--rotation": `${rotatePost(post.id)}deg` } as React.CSSProperties}>
			<div
				className={styles.polaroidFrame}
				data-editing={isEditing}>
				{post.media_url && (
					<div className={styles.polaroidWindow}>
						<img
							className={styles.postMedia}
							src={post.media_url}
							alt="Post media"
						/>
						<time className={styles.timestamp}>
							{formatPolaroidDate(post.created_at.toString())}
						</time>
					</div>
				)}
				{isEditing ? (
					<textarea
						className={styles.textArea}
						value={bodyText}
						onChange={(e) => setBodyText(e.target.value)}
						disabled={isLoading}
						autoFocus
					/>
				) : (
					<p className={styles.postBody}>{post.body_text || ""}</p>
				)}
			</div>

			<div className={styles.postInfo}>
				<div className={styles.postDetails}>
					<div className={styles.userBadge}>
						<UserBadgeKeycap
							user={author}
							mode="column"
						/>
					</div>
				</div>

				<div className={styles.actionsColumn}>
					<div
						className={styles.deleteButton}
						data-editing={isEditing}>
						<TactileButtonWithConfirm
							colour="red"
							disabled={isDeleting}
							onRelease={() => deletePost({ postId: post.id })}
							resetTrigger={isEditing}
							isMini={true}>
							{isDeleting ? "..." : "Del"}
						</TactileButtonWithConfirm>
					</div>
					{isOwner && (
						<EditPostToolbar
							isEditing={isEditing}
							onToggleEdit={handleToggleEdit}
							onSave={handleSave}
							isBusy={isLoading}
							isEmpty={isEmpty}
							hasBeenEdited={hasBeenEdited}
							mode="column"
						/>
					)}
					<div className={styles.interactionBar}>
						<InteractionBar disabled={isEditing} />
					</div>
				</div>
			</div>
		</div>
	);
}
