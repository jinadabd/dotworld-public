import type { PostVisibility } from "@shared/types";
import { useComposePost, type UseComposePostReturn } from "../../hooks/useComposePost";
import { TactileButton } from "../../components/buttons/TactileButton";
import formStyles from "../../styles/Form.module.css";
import { PostVisibilityToggle } from "./PostVisibilityToggle";
import { FileUploadButton } from "../../components/buttons/FileUploadButton";

interface Props {
	compose: UseComposePostReturn;
}

export function ComposePostForm({ compose }: Props) {
	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		await compose.submit();
	}

	return (
		<form
			id="compose-post-form"
			onSubmit={handleSubmit}>
			<textarea
				className={formStyles.textArea}
				value={compose.bodyText}
				onChange={(e) => compose.setBodyText(e.target.value)}
				placeholder="What's on your mind?"
				rows={4}
			/>

			<div className={formStyles.postOptions}>
				<PostVisibilityToggle
					visibility={compose.visibility}
					setVisibility={compose.setVisibility}
				/>

				<FileUploadButton
					selectedFile={compose.mediaFile}
					onFileSelect={(file) => compose.setMediaFile(file)}
				/>
			</div>
		</form>
	);
}
