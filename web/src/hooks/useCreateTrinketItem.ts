import type { PostType } from "@shared/types";
import { useState } from "react";
import { useFileUpload } from "./useFileUpload";
import { useCreateTrinketItemMutation } from "../features/trinkets/trinketApi";

interface UseCreateTrinketItemProps {
	trinketId: number;
	nextOrder: number;
}

export function useCreateTrinketItem({ trinketId, nextOrder }: UseCreateTrinketItemProps) {
	const [itemType, setItemType] = useState<PostType>("image");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [mediaFile, setMediaFile] = useState<File | null>(null);

	const { upload, isUploading } = useFileUpload();
	const [createTrinketItem, { isLoading }] = useCreateTrinketItemMutation();

	const hasTitle = title.trim().length > 0;
	const hasContent = hasTitle || mediaFile != null || description.trim().length > 0;
	const isBusy = isLoading || isUploading;

	async function submit() {
		if (!hasContent || isBusy) return;

		try {
			const mediaURL = mediaFile ? await upload(mediaFile, "post_media") : undefined;

			await createTrinketItem({
				trinketId: trinketId,
				input: {
					trinket_id: trinketId,
					item_type: itemType,
					item_order: nextOrder,
					title: title.trim() || undefined,
					description: description.trim() || undefined,
					media_url: mediaURL,
					file_size_bytes: mediaFile?.size ?? 0,
				},
			}).unwrap();

			setTitle("");
			setDescription("");
			setMediaFile(null);
			setItemType("image");
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
		submit,
		hasTitle,
		hasContent,
		isBusy,
	};
}

export type UseCreateTrinketItemReturn = ReturnType<typeof useCreateTrinketItem>;
