import type { TrinketType, TrinketVisibility } from "@shared/types";
import { useState } from "react";
import { useFileUpload } from "./useFileUpload";
import { useCreateTrinketMutation } from "../features/trinkets/trinketApi";

export function useCreateTrinket(onSuccess?: () => void) {
	const [visibility, setVisibility] = useState<TrinketVisibility>("friends");
	const [type, setType] = useState<TrinketType>("collection");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [coverFile, setCoverFile] = useState<File | null>(null);

	const { upload, isUploading } = useFileUpload();
	const [createTrinket, { isLoading }] = useCreateTrinketMutation();

	const hasTitle = title.trim().length > 0;
	// const hasContent = description.trim().length > 0 || coverFile != null;
	const isBusy = isLoading || isUploading;

	async function submit() {
		if (!hasTitle || isBusy) return;

		try {
			const mediaURL = coverFile ? await upload(coverFile, "post_media") : undefined;

			await createTrinket({
				trinket_visibility: visibility,
				trinket_type: type,
				title: title,
				description: description.trim() || undefined,
				cover_url: mediaURL,
				file_size_bytes: coverFile?.size ?? 0,
			}).unwrap();

			setVisibility("friends");
			setType("collection");
			setTitle("");
			setDescription("");
			setCoverFile(null);
			onSuccess?.();
		} catch {}
	}

	// function handlePaste(e: React.ClipboardEvent) {
	// 	const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith("image/"));
	// 	if (item) setMediaFile(item.getAsFile());
	// }

	return {
		visibility,
		setVisibility,
		type,
		setType,
		title,
		setTitle,
		description,
		setDescription,
		coverFile,
		setCoverFile,
		submit,
		hasTitle,
		isBusy,
	};
}
