import { UserBadge } from "../../components/badges/UserBadge";
import { useGetUserQuery } from "./userApi";

interface Props {
	userId: number;
	children?: React.ReactNode;
	style?: CSSModuleClasses;
}

export function FetchedUserBadge({ userId, children, style }: Props) {
	const { data: user, isLoading } = useGetUserQuery(userId);
	if (isLoading || !user) return <></>;
	return (
		<UserBadge
			user={user}
			style={style}>
			{children}
		</UserBadge>
	);
}
