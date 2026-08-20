import type { PostVisibility } from "@shared/types";
import { useComposePost } from "../../hooks/useComposePost";
import { TactileButton } from "../../components/buttons/TactileButton";

interface Props {
	onSuccess?: () => void;
	onCancel?: () => void;
}

export function ComposePostForm({ onSuccess, onCancel }: Props) {
	const compose = useComposePost(onSuccess);

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		await compose.submit();
	}

	return (
		<form onSubmit={handleSubmit}>
			<h3>Create a Post</h3>

			<textarea
				value={compose.bodyText}
				onChange={(e) => compose.setBodyText(e.target.value)}
				placeholder="What's on your mind?"
				rows={4}
			/>

			<select
				value={compose.visibility}
				onChange={(e) => compose.setVisibility(e.target.value as PostVisibility)}>
				<option value="friends">Friends</option>
				{/* <option value="bubble">Bubble</option> */}
				<option value="self">Self</option>
			</select>

			<input
				type="file"
				accept="image/*, video/*, audio/*"
				onChange={(e) => compose.setMediaFile(e.target.files?.[0] ?? null)}
			/>

			<TactileButton
				type="submit"
				disabled={!compose.hasContent || compose.isBusy}>
				{compose.isBusy ? "Posting..." : "Post"}
			</TactileButton>

			{onCancel && (
				<TactileButton
					type="button"
					onClick={onCancel}>
					Cancel
				</TactileButton>
			)}
		</form>
	);
}
