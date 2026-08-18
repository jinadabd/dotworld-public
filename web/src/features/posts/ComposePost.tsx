import { useState } from "react";
import { useCreatePostMutation } from "./postsApi";
import { useFileUpload } from "../../hooks/useFileUpload";
import type { PostVisibility, PostType } from "@shared/types";

export function ComposePost() {
	const [isOpen, setIsOpen] = useState(false);
	const [bodyText, setBodyText] = useState("");
	const [visibility, setVisibility] = useState<PostVisibility>("friends");
	const [postType, setPostType] = useState<PostType>("text");
	const [mediaFile, setMediaFile] = useState<File | null>(null);

	const { upload, isUploading } = useFileUpload();
	const [createPost, { isLoading }] = useCreatePostMutation();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		try {
			let mediaUrl: string | undefined = undefined;

			if (mediaFile) {
				mediaUrl = await upload(mediaFile, "post_media");
			}

			await createPost({
				body_text: bodyText.trim() ? bodyText : undefined,
				post_visibility: visibility,
				post_type: postType,
				media_url: mediaUrl,
				file_size_bytes: mediaFile ? mediaFile.size : 0,
			}).unwrap();

			// Reset Form & Close
			setBodyText("");
			setMediaFile(null);
			setIsOpen(false);
		} catch {
			// Handled by upload / mutation state
		}
	}

	return (
		<div>
			<button onClick={() => setIsOpen((prev) => !prev)}>
				{isOpen ? "Close" : "+ New Post"}
			</button>

			{isOpen && (
				<form onSubmit={handleSubmit}>
					<h3>Create a Post</h3>

					<textarea
						value={bodyText}
						onChange={(e) => setBodyText(e.target.value)}
						placeholder="What's on your mind?"
						rows={4}
					/>

					<div>
						<select
							value={visibility}
							onChange={(e) => setVisibility(e.target.value as PostVisibility)}>
							<option value="public">Public</option>
							<option value="friends">Friends Only</option>
							<option value="private">Private</option>
						</select>

						<select
							value={postType}
							onChange={(e) => setPostType(e.target.value as PostType)}>
							<option value="text">Text</option>
							<option value="image">Image</option>
							<option value="media">Media</option>
						</select>

						<input
							type="file"
							onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)}
						/>
					</div>

					<div>
						<button
							type="submit"
							disabled={isLoading || isUploading}>
							{isLoading || isUploading ? "Posting..." : "Post"}
						</button>
						<button
							type="button"
							onClick={() => setIsOpen(false)}>
							Cancel
						</button>
					</div>
				</form>
			)}
		</div>
	);
}
