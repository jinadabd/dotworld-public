import type { UseCreateTrinketItemReturn } from "../../../hooks/useCreateTrinketItem";
import { FileUploadButton } from "../../../components/buttons/FileUploadButton";

import formStyles from "../../../styles/Form.module.css";

interface Props {
	createItem: UseCreateTrinketItemReturn;
}

export function CreateTrinketItemForm({ createItem }: Props) {
	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		await createItem.submit();
	}

	return (
		<form
			id="create-trinket-item-form"
			onSubmit={handleSubmit}>
			<input
				className={formStyles.textInput}
				value={createItem.title}
				onChange={(e) => createItem.setTitle(e.target.value)}
				placeholder="Item title (optional)..."
			/>

			<textarea
				className={formStyles.textArea}
				value={createItem.description}
				onChange={(e) => createItem.setDescription(e.target.value)}
				placeholder="Caption or notes..."
				rows={3}
			/>

			<div className={formStyles.trinketOptions}>
				<div className={formStyles.optionRow}>
					<FileUploadButton
						selectedFile={createItem.mediaFile}
						onFileSelect={(file) => createItem.setMediaFile(file)}
					/>
				</div>
			</div>
		</form>
	);
}
