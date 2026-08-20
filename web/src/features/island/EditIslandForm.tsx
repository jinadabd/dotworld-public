import { useState } from "react";
import { useCreateIslandMutation } from "./islandApi";
import { useNavigate } from "react-router-dom";
import { extractErrorMessage } from "../../utils/errors";
import { type IslandRow, type IslandVisibility } from "@shared/types";
import { VisibilityToggle } from "./VisibilityToggle";
import { useFileUpload } from "../../hooks/useFileUpload";

// export interface EditIslandInput {
// 	island_id: number;
// 	options: EditIslandOptions[];
// 	island_visibility?: IslandVisibility;
// 	name?: string;
// 	description?: string;
// 	cover_url?: string;
// 	metadata?: JSONValue;
// }

export function EditIslandForm({ island }: { island: IslandRow }) {
	const [visibility, setVisibility] = useState<IslandVisibility>(island.island_visibility);
	const [name, setName] = useState(island.name ?? "");
	const [description, setDescription] = useState(island.description ?? "");

	const [coverFile, setCoverFile] = useState<File | null>(null);
	const { upload, isUploading } = useFileUpload();

	const [metadata, setMetadata] = useState("");

	const [createIsland, { isLoading, error }] = useCreateIslandMutation();

	const navigate = useNavigate();

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const coverURL = coverFile ? await upload(coverFile, "island_cover") : undefined;
			await createIsland({
				username,
				input: {
					island_visibility: visibility,
					name,
					description,
					cover_url: coverURL,
					metadata: metadata.trim() ? metadata : undefined,
				},
			}).unwrap();

			navigate(`/${username}`);
		} catch {}
	}

	return (
		<div>
			<h1>Create Island</h1>
			<form onSubmit={handleSubmit}>
				<VisibilityToggle
					value={visibility}
					onChange={setVisibility}
				/>
				<input
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="name"
				/>
				<input
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="description"
				/>
				<input
					type="file"
					accept="image/*"
					onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
				/>
				{/* <input
				value={metadata}
				onChange={(e) => setMetadata(e.target.value)}
				placeholder="metadata"
			/> */}

				<button
					type="submit"
					disabled={isLoading || isUploading}>
					Create Island
				</button>
				{error && <p>{extractErrorMessage(error)}</p>}
			</form>
		</div>
	);
}
