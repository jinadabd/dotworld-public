import { UserBadgeKeycap } from "../../components/buttons/KeycapUserBadge";
import { useGetUserQuery } from "./userApi";

interface Props {
	userId: number;
	mode?: "row" | "column";
}

export function FetchedUserBadge({ userId, mode = "row" }: Props) {
	const { data: user, isLoading } = useGetUserQuery(userId);
	if (isLoading || !user) return <></>;
	return (
		<UserBadgeKeycap
			user={user}
			mode={mode}
		/>
	);
}
