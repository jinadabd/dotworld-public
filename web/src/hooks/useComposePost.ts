import type { PostVisibility, PostType } from "@shared/types";
import { useState } from "react";
import { useFileUpload } from "./useFileUpload";
import { useCreatePostMutation } from "../features/posts/postsApi";

export function useComposePost(onSuccess?: () => void) {
	const [bodyText, setBodyText] = useState("");
	const [visibility, setVisibility] = useState<PostVisibility>("friends");
	const [mediaFile, setMediaFile] = useState<File | null>(null);

	const { upload, isUploading } = useFileUpload();
	const [createPost, { isLoading }] = useCreatePostMutation();

	const hasContent = bodyText.trim().length > 0 || mediaFile != null;
	const isBusy = isLoading || isUploading;

	function inferPostType(file: File | null): PostType {
		if (!file) return "text";
		if (file.type.startsWith("image/")) return "image";
		if (file.type.startsWith("video/")) return "video";
		if (file.type.startsWith("audio/")) return "audio";
		return "text";
	}

	async function submit() {
		if (!hasContent || isBusy) return;
		if (!bodyText.trim() && !mediaFile) return;

		try {
			const mediaURL = mediaFile ? await upload(mediaFile, "post_media") : undefined;

			await createPost({
				body_text: bodyText.trim() || undefined,
				post_visibility: visibility,
				post_type: inferPostType(mediaFile),
				media_url: mediaURL,
				file_size_bytes: mediaFile?.size ?? 0,
			}).unwrap();

			setBodyText("");
			setMediaFile(null);
			onSuccess?.();
		} catch {}
	}

	function handlePaste(e: React.ClipboardEvent) {
		const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith("image/"));
		if (item) setMediaFile(item.getAsFile());
	}

	return {
		bodyText,
		setBodyText,
		visibility,
		setVisibility,
		mediaFile,
		setMediaFile,
		handlePaste,
		submit,
		hasContent,
		isBusy,
	};
}
