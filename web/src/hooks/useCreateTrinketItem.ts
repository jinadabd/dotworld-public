import type { PostType, JSONValue } from "@shared/types";
import { useState } from "react";
import { useFileUpload } from "./useFileUpload";
import { useCreateTrinketItemMutation } from "../features/trinkets/trinketApi";

interface UseCreateTrinketItemProps {
	trinketId: number;
	nextOrder?: number;
}

export function useCreateTrinketItem({ trinketId, nextOrder = 1 }: UseCreateTrinketItemProps) {
	const [itemType, setItemType] = useState<PostType>("image");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [mediaFile, setMediaFile] = useState<File | null>(null);
	const [metadata, setMetadata] = useState<JSONValue | undefined>(undefined);

	const { upload, isUploading } = useFileUpload();
	const [createTrinketItem, { isLoading }] = useCreateTrinketItemMutation();

	const isBusy = isLoading || isUploading;
	// Valid if there is a file selected or text content entered
	const hasContent =
		mediaFile != null || title.trim().length > 0 || description.trim().length > 0;

	async function submit() {
		if (!hasContent || isBusy) return false;

		try {
			const mediaURL = mediaFile ? await upload(mediaFile, "post_media") : undefined;

			await createTrinketItem({
				trinket_id: trinketId,
				item_type: itemType,
				item_order: nextOrder,
				file_size_bytes: mediaFile?.size ?? 0,
				title: title.trim() || undefined,
				description: description.trim() || undefined,
				media_url: mediaURL,
				metadata: metadata,
			}).unwrap();

			// Reset form state
			setTitle("");
			setDescription("");
			setMediaFile(null);
			setMetadata(undefined);
			return true;
		} catch {
			return false;
		}
	}

	return {
		itemType,
		setItemType,
		title,
		setTitle,
		description,
		setDescription,
		mediaFile,
		setMediaFile,
		metadata,
		setMetadata,
		submit,
		hasContent,
		isBusy,
	};
}

export type UseCreateTrinketItemReturn = ReturnType<typeof useCreateTrinketItem>;
