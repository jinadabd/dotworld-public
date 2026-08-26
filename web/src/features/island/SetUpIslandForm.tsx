import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IslandVisibility } from "@shared/types";
import { useCreateIslandMutation } from "./islandApi";
import { extractErrorMessage } from "../../utils/errors";
import { IslandVisibilityToggle } from "./IslandVisibilityToggle";
import { useFileUpload } from "../../hooks/useFileUpload";
import { SealKeycap } from "../../components/buttons/SealKeycap";

import { TactileButton } from "../../components/buttons/TactileButton";
import { FileUploadButton } from "../../components/buttons/FileUploadButton";

import pageStyles from "../../styles/MainPage.module.css";
import formStyles from "../../styles/Form.module.css";
import islandStyles from "./Island.module.css";

interface Props {
	username: string;
	userId: number;
}

export function SetUpIslandForm({ username, userId }: Props) {
	const [step, setStep] = useState<"welcome" | "form">("welcome");

	const [visibility, setVisibility] = useState<IslandVisibility>("friends");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [coverFile, setCoverFile] = useState<File | null>(null);
	const [metadata, setMetadata] = useState("");

	const { upload, isUploading } = useFileUpload();
	const [createIsland, { isLoading, error }] = useCreateIslandMutation();
	const navigate = useNavigate();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
		} catch {
			// Error handled by extractErrorMessage in render
		}
	}

	return (
		<div className={pageStyles.pageContainer}>
			<div className={pageStyles.pageHeader}>
				<h1
					className={pageStyles.pageTitle}
					style={step === "welcome" ? { opacity: "0", pointerEvents: "none" } : {}}>
					Your Island
				</h1>
			</div>

			<div className={pageStyles.pageMain}>
				{step === "welcome" ? (
					<div className={formStyles.welcomeCard}>
						<div className={formStyles.sealContainer}>
							<SealKeycap
								seed={userId.toString()}
								colour="yellow"
							/>
						</div>

						<h2 className={formStyles.welcomeTitle}>Welcome to dotworld!</h2>
						<p className={formStyles.welcomeText}>
							{
								"This is your unique user seal.\n\nIt will represent your island across the dotworld."
							}
						</p>

						<div className={formStyles.welcomeButton}>
							<TactileButton
								type="button"
								onRelease={() => setStep("form")}>
								Got it
							</TactileButton>
						</div>
					</div>
				) : (
					<div className={formStyles.islandView}>
						<form onSubmit={handleSubmit}>
							<input
								type="text"
								className={formStyles.textInput}
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Give your Island a name"
								required
							/>

							<textarea
								className={formStyles.textArea}
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Description"
							/>
							<div className={formStyles.postOptions}>
								<div className={formStyles.formGroup}>
									<label className={formStyles.tooltip}>Visibility</label>
									<div className={formStyles.visibilityToggle}>
										<IslandVisibilityToggle
											visibility={visibility}
											setVisibility={setVisibility}
										/>
									</div>
								</div>
								<div className={formStyles.formGroup}>
									<label className={formStyles.tooltip}>Cover</label>
									<div className={formStyles.uploadButton}>
										<FileUploadButton
											selectedFile={coverFile}
											onFileSelect={(file) => setCoverFile(file)}
										/>
									</div>
								</div>
							</div>

							{error && (
								<p className={formStyles.errorMessage}>
									{extractErrorMessage(error)}
								</p>
							)}

							<div className={formStyles.submitButton}>
								<TactileButton
									type="submit"
									colour="yellow"
									disabled={isLoading || isUploading}>
									{isLoading || isUploading ? "Creating..." : "Create"}
								</TactileButton>
							</div>
						</form>
					</div>
				)}
			</div>
		</div>
	);
}
