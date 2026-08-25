import { useEffect, useMemo, useState } from "react";
import { UserSealIcon } from "../../components/buttons/icons";
import { generateUserSeal, type UserSeal } from "../../utils/generateSeal";
import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";
import type { PublicUser, TrinketRow, TrinketWithAuthor } from "@shared/types";
import { useNavigate } from "react-router-dom";

interface Props {
	user: PublicUser;
	trinket: TrinketRow | TrinketWithAuthor;
}

export function TrinketBadge({ user, trinket }: Props) {
	const navigate = useNavigate();
	const onRelease = () => navigate(`/${user.username}`);

	const seal = useMemo(() => {
		return generateUserSeal(user.username || user.id.toString());
	}, [user.username, user.id]);

	const keys: KeyPosition[] = [
		{
			id: `title-${trinket.id}`,
			col: 1,
			row: 1,
			colSpan: 3,
			keycapProps: {
				colour: "green",
				legend: "⬤",
				children: trinket.title,
			},
		},
		{
			id: `type-${trinket.id}`,
			col: 1,
			row: 2,
			colSpan: 2,
			keycapProps: {
				colour: "green",
				children:
					trinket.trinket_type === "collection"
						? "Collection"
						: trinket.trinket_type === "gallery"
							? "Gallery"
							: "Playlist",
			},
		},
		{
			id: `seal-${user.id}`,
			col: 3,
			row: 2,
			keycapProps: {
				colour: "yellow",
				isActive: true,
				onRelease,
				children: <UserSealIcon seal={seal} />,
			},
		},
	];

	return (
		<KeyboardLayout
			keys={keys}
			columns={3}
			rows={2}
			plateColor="#272727"
		/>
	);
}
