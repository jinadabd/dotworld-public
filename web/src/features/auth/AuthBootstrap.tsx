import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useMeQuery } from "./authApi";
import type { ReactNode } from "react";

export function AuthBootstrap({ children }: { children: ReactNode }) {
	const token = useSelector((state: RootState) => state.auth.token);
	const user = useSelector((state: RootState) => state.auth.user);
	const { isLoading } = useMeQuery(undefined, { skip: !token || !!user });

	if (token && !user && isLoading) return <p>Loading...</p>;
	return children;
}
