import { useEffect, useState } from "react";
import { FriendsIcon, UserSealIcon } from "./icons";
import { generateUserSeal, type UserSeal } from "../../utils/generateSeal";
import { KeyboardLayout, type KeyPosition } from "./KeyboardLayout";
import type { PublicUser } from "@shared/types";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
	user: PublicUser;
	mode?: "row" | "column";
}

const DEFAULT_SEAL: UserSeal = {
	grid: [
		[false, false, false, false, false],
		[false, false, false, false, false],
		[false, false, true, false, false],
		[false, false, false, false, false],
		[false, false, false, false, false],
	],
	color: "var(--dark)",
};

export function UserBadgeKeycap({ user, mode = "row" }: Props) {
	const [seal, setSeal] = useState<UserSeal>(DEFAULT_SEAL);
	const navigate = useNavigate();
	const onRelease = () => navigate(`/${user.username}`);

	useEffect(() => {
		let isMounted = true;

		generateUserSeal(user.username || user.id.toString()).then((res) => {
			if (isMounted) setSeal(res);
		});

		return () => {
			isMounted = false;
		};
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
				// isActive: true,
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
