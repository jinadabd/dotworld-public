import type { UseCreateTrinketReturn } from "../../hooks/useCreateTrinket";
import { TrinketVisibilityToggle } from "./TrinketVisibilityToggle";
import { TrinketTypeToggle } from "./TrinketTypeToggle";
import { FileUploadButton } from "../../components/buttons/FileUploadButton";

import formStyles from "../../styles/Form.module.css";

interface Props {
	create: UseCreateTrinketReturn;
}

export function CreateTrinketForm({ create }: Props) {
	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		await create.submit();
	}

	return (
		<form
			id="create-trinket-form"
			onSubmit={handleSubmit}>
			<input
				className={formStyles.textInput}
				value={create.title}
				onChange={(e) => create.setTitle(e.target.value)}
				placeholder="Give your trinket a name..."
				required
			/>

			<textarea
				className={formStyles.textArea}
				value={create.description}
				onChange={(e) => create.setDescription(e.target.value)}
				placeholder="Description..."
				rows={4}
			/>

			<div className={formStyles.trinketOptions}>
				<div className={formStyles.optionRow}>
					<div className={formStyles.visibilityToggle}>
						<TrinketVisibilityToggle
							visibility={create.visibility}
							setVisibility={create.setVisibility}
						/>
					</div>

					<div className={formStyles.uploadButton}>
						<FileUploadButton
							selectedFile={create.coverFile}
							onFileSelect={(file) => create.setCoverFile(file)}
						/>
					</div>
				</div>

				<div className={formStyles.typeToggles}>
					<TrinketTypeToggle
						type={create.type}
						setType={create.setType}
					/>
				</div>
			</div>
		</form>
	);
}
