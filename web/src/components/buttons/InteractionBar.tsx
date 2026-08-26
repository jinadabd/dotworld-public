import { useRef, useState } from "react";
import { StarIcon } from "./icons";
import { KeyboardLayout, type KeyPosition } from "./KeyboardLayout";

interface Props {
	disabled?: boolean;
}

export function InteractionBar({ disabled = false }: Props) {
	const [isStarred, setIsStarred] = useState(false);
	const isStarredRef = useRef(isStarred);
	isStarredRef.current = isStarred;
	const handleStarToggle = () => {
		const nextState = !isStarredRef.current;
		isStarredRef.current = nextState;
		setIsStarred(nextState);
	};

	const [isReplying, setIsReplying] = useState(false);
	const isReplyingRef = useRef(isReplying);
	isReplyingRef.current = isReplying;
	const handleReplyToggle = () => {
		const nextState = !isReplyingRef.current;
		isReplyingRef.current = nextState;
		setIsReplying(nextState);
	};

	const interactionKeys: KeyPosition[] = [
		{
			id: "starIcon",
			col: 1,
			row: 1,
			colSpan: 1,
			keycapProps: {
				colour: "blue",
				disabled,
				isActive: isStarred,
				onPress: handleStarToggle,
				onRelease: handleStarToggle,
				children: <StarIcon />,
			},
		},
		{
			id: "replyIcon",
			col: 2,
			row: 1,
			colSpan: 1,
			keycapProps: {
				colour: "red",
				disabled,
				isActive: isReplying,
				onPress: handleReplyToggle,
				onRelease: handleReplyToggle,
				children: "R",
			},
		},
	];

	return (
		<KeyboardLayout
			keys={interactionKeys}
			columns={2}
			rows={1}
			plateColor="var(--dark)"
		/>
	);
}
