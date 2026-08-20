import { TactileButton } from "../../components/buttons/TactileButton";
import { useComposePost } from "../../hooks/useComposePost";

export function ComposeWidget() {
	const compose = useComposePost();

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			compose.submit();
		}
	}

	return (
		<div>
			<textarea
				value={compose.bodyText}
				onChange={(e) => compose.setBodyText(e.target.value)}
				onPaste={compose.handlePaste}
				onKeyDown={handleKeyDown}
				placeholder="What's on your mind?"
				rows={1}
			/>

			{compose.mediaFile && <p>{compose.mediaFile.name} attached</p>}
			<TactileButton
				onClick={compose.submit}
				disabled={!compose.hasContent || compose.isBusy}>
				{compose.isBusy ? "Posting..." : "Post"}
			</TactileButton>
		</div>
	);
}
