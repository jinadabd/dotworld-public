import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { PublicUser } from "@shared/types";
import { FriendsIcon, UserSealIcon } from "./icons";
import { generateUserSeal } from "../../utils/generateSeal";
import { KeyboardLayout, type KeyPosition } from "./KeyboardLayout";

interface Props {
	user: PublicUser;
	mode?: "row" | "column";
}

export function UserBadgeKeycap({ user, mode = "row" }: Props) {
	const navigate = useNavigate();
	const onRelease = () => navigate(`/${user.username}`);

	// Synchronous computation — calculated instantly on the first render frame
	const seal = useMemo(() => {
		return generateUserSeal(user.username || user.id.toString());
	}, [user.username, user.id]);

	const keys: KeyPosition[] = [
		{
			id: `seal-${user.id}`,
			col: 1,
			row: 1,
			keycapProps: {
				colour: "yellow",
				isActive: true,
				onRelease,
				children: <UserSealIcon seal={seal} />,
			},
		},
		{
			id: `name-${user.id}`,
			col: 2,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "cream",
				onRelease,
				children: <span>{user.name || user.username}</span>,
			},
		},
		{
			id: `handle-${user.id}`,
			col: mode === "row" ? 4 : 1,
			row: mode === "row" ? 1 : 2,
			colSpan: 2,
			keycapProps: {
				colour: "cream",
				onRelease,
				children: <span style={{ fontFamily: "Bitcount" }}>@{user.username}</span>,
			},
		},
		{
			id: `friendship-${user.id}`,
			col: mode === "row" ? 6 : 3,
			row: mode === "row" ? 1 : 2,
			colSpan: 1,
			keycapProps: {
				colour: "blue",
				children: <FriendsIcon />,
			},
		},
	];

	return (
		<KeyboardLayout
			keys={keys}
			columns={3}
			rows={mode === "row" ? 1 : 2}
			plateColor="#272727"
		/>
	);
}
