import { useState } from "react";
import { useCreateIslandMutation } from "./islandApi";
import { useNavigate } from "react-router-dom";
import { extractErrorMessage } from "../../utils/errors";
import { type IslandVisibility } from "@shared/types";
import { VisibilityToggle } from "./VisibilityToggle";
import { useFileUpload } from "../../hooks/useFileUpload";

export function SetUpIslandForm({ username }: { username: string }) {
	const [visibility, setVisibility] = useState<IslandVisibility>("friends");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

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
	);
}
