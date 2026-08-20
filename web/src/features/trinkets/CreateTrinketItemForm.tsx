import { useState } from "react";
import { useCreateTrinketItemMutation } from "./trinketApi";
import { useFileUpload } from "../../hooks/useFileUpload";
import type { PostType, TrinketRow, TrinketType } from "@shared/types";

const ALLOWED_TYPES: Record<TrinketType, PostType[]> = {
	playlist: ["audio"],
	gallery: ["image", "video"],
	collection: ["image", "text", "audio"],
};

interface Props {
	trinket: TrinketRow;
	nextOrder: number;
	onSuccess?: () => void;
	onCancel?: () => void;
}

export function CreateTrinketItemForm({ trinket, nextOrder, onSuccess, onCancel }: Props) {
	const allowedTypes = ALLOWED_TYPES[trinket.trinket_type];
	const [type, setType] = useState<PostType>(allowedTypes[0]);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [mediaFile, setMediaFile] = useState<File | null>(null);

	const { upload, isUploading } = useFileUpload();
	const [createTrinketItem, { isLoading }] = useCreateTrinketItemMutation();

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const mediaURL = mediaFile ? await upload(mediaFile, "trinket_item_media") : undefined;

			await createTrinketItem({
				trinketId: trinket.id,
				input: {
					trinket_id: trinket.id,
					item_type: type,
					item_order: nextOrder,
					file_size_bytes: mediaFile ? mediaFile.size : 0,
					title: title.trim() || undefined,
					description: description.trim() || undefined,
					media_url: mediaURL,
				},
			}).unwrap();

			onSuccess?.();
		} catch {}
	}

	return (
		<form onSubmit={handleSubmit}>
			<h3>Create New Trinket Item</h3>

			{allowedTypes.length > 1 && (
				<select
					value={type}
					onChange={(e) => setType(e.target.value as PostType)}>
					{allowedTypes.map((t) => (
						<option
							key={t}
							value={t}>
							{t}
						</option>
					))}
				</select>
			)}

			{type !== "text" && (
				<input
					type="file"
					accept={`${type}/*`}
					onChange={(e) => setMediaFile(e.target.files?.[0] ?? null)}
				/>
			)}

			<input
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Title"
			/>

			<textarea
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				placeholder="Description"
			/>

			<div>
				<button
					type="submit"
					disabled={isLoading || isUploading}>
					{isLoading || isUploading ? "Adding..." : "Add"}
				</button>
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}>
						Cancel
					</button>
				)}
			</div>
		</form>
	);
}
