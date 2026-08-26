import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { Navigate, Outlet } from "react-router-dom";

export function HomeRoute() {
	const token = useSelector((state: RootState) => state.auth.token);
	const user = useSelector((state: RootState) => state.auth.user);

	if (!token) return <Outlet />;
	if (!user) return <p>Loading...</p>;
	return (
		<Navigate
			to={`/${user.username}`}
			replace
		/>
	);
}
