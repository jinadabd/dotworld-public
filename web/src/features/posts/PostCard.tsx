import { useState } from "react";
import { type PostWithAuthor, type EditPostInput, EditPostOptions } from "@shared/types";
import { InteractionBar } from "../../components/buttons/InteractionBar";
import { formatDate } from "../../utils/formatDate";
import { UserBadgeKeycap } from "../../components/buttons/KeycapUserBadge";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useEditPostMutation } from "../posts/postsApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { EditPostToolbar } from "./EditPostToolbar";

import styles from "./Posts.module.css";
import { TactileButtonWithConfirm } from "../../components/buttons/TactileButtonWithConfirm";

interface PostCardProps {
	postWithAuthor: PostWithAuthor;
}

export function PostCard({ postWithAuthor }: PostCardProps) {
	const { post, author } = postWithAuthor;
	const isMobile = useMediaQuery("(max-width: 768px)");

	const [isEditing, setIsEditing] = useState(false);
	const [bodyText, setBodyText] = useState(post.body_text || "");
	const [editPost, { isLoading }] = useEditPostMutation();

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

	return (
		<div
			className={styles.postCard}
			data-type={post.post_type}
			data-editing={isEditing}>
			<div className={styles.postDetails}>
				<div className={styles.userBadge}>
					<UserBadgeKeycap
						user={author}
						mode={"row"}
					/>
				</div>

				<div className={styles.detailsRight}>
					{!isMobile && (
						<time className={styles.timestamp}>{formatDate(post.created_at)}</time>
					)}
				</div>
			</div>

			<div className={styles.postContent}>
				{isEditing ? (
					<textarea
						className={styles.textArea}
						value={bodyText}
						onChange={(e) => setBodyText(e.target.value)}
						disabled={isLoading}
						autoFocus
					/>
				) : (
					post.body_text && <p className={styles.postBody}>{post.body_text}</p>
				)}
			</div>

			<div className={styles.postFooter}>
				{isMobile && (
					<time className={styles.timestamp}>{formatDate(post.created_at)}</time>
				)}
				<div className={styles.footerLeft}>
					{isEditing && <TactileButtonWithConfirm>Delete</TactileButtonWithConfirm>}
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
						/>
					)}
					<div className={styles.interactionBar}>
						<InteractionBar />
					</div>
				</div>
			</div>
		</div>
	);
}
