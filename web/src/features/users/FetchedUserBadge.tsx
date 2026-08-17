import { UserBadge } from "../../components/badges/UserBadge";
import { useGetUserQuery } from "./userApi";

interface Props {
	userId: number;
	children?: React.ReactNode;
}

export function FetchedUserBadge({ userId, children }: Props) {
	const { data: user, isLoading } = useGetUserQuery(userId);
	if (isLoading || !user) return <></>;
	return <UserBadge user={user}>{children}</UserBadge>;
}
