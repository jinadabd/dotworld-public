import { useState } from "react";
import { useCreateTrinketMutation } from "./trinketApi";
import { useFileUpload } from "../../hooks/useFileUpload";
import type { TrinketVisibility, TrinketType } from "@shared/types";

interface Props {
	onSuccess?: () => void;
	onCancel?: () => void;
}

export function CreateTrinketForm({ onSuccess, onCancel }: Props) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [visibility, setVisibility] = useState<TrinketVisibility>("friends");
	const [type, setType] = useState<TrinketType>("collection");
	const [coverFile, setCoverFile] = useState<File | null>(null);

	const { upload, isUploading } = useFileUpload();
	const [createTrinket, { isLoading, error }] = useCreateTrinketMutation();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const coverURL = coverFile ? await upload(coverFile, "trinket_cover") : undefined;

			await createTrinket({
				title,
				description: description.trim() ? description : undefined,
				trinket_visibility: visibility,
				trinket_type: type,
				cover_url: coverURL,
				file_size_bytes: coverFile ? coverFile.size : 0,
			}).unwrap();

			onSuccess?.();
		} catch {}
	}

	return (
		<form onSubmit={handleSubmit}>
			<h3>Create New Trinket</h3>

			<input
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Title"
				required
			/>

			<textarea
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				placeholder="Description"
			/>

			<select
				value={visibility}
				onChange={(e) => setVisibility(e.target.value as TrinketVisibility)}>
				<option value="public">Public</option>
				<option value="friends">Friends</option>
				<option value="private">Private</option>
			</select>

			<select
				value={type}
				onChange={(e) => setType(e.target.value as TrinketType)}>
				<option value="standard">Standard</option>
			</select>

			<input
				type="file"
				accept="image/*"
				onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
			/>

			<div>
				<button
					type="submit"
					disabled={isLoading || isUploading}>
					{isLoading || isUploading ? "Creating..." : "Create"}
				</button>
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}>
						Cancel
					</button>
				)}
			</div>

			{error && <p>Failed to create trinket.</p>}
		</form>
	);
}
