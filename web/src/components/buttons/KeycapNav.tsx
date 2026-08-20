// KeycapNav.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { KeyboardLayout } from "./KeyboardLayout";
import type { KeyPosition } from "./KeyboardLayout";
import { IslandIcon, TrinketsIcon, FriendsIcon, ChatterIcon } from "./icons";
import type { RootState } from "../../app/store";

export function KeycapNav() {
	const location = useLocation();
	const navigate = useNavigate();
	const username = useSelector((state: RootState) => state.auth.user!.username);

	const navKeys: KeyPosition[] = [
		{
			id: "island",
			col: 1,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "yellow",
				legend: "⬤",
				isActive: location.pathname === `/${username}`,
				onPress: () => navigate(`/${username}`),
				children: (
					<>
						<IslandIcon size={20} />
						<span>Island</span>
					</>
				),
			},
		},
		{
			id: "trinkets",
			col: 1,
			row: 2,
			colSpan: 2,
			keycapProps: {
				colour: "green",
				legend: "⬤",
				isActive: location.pathname === "/trinkets",
				onPress: () => navigate("/trinkets"),
				children: (
					<>
						<TrinketsIcon size={20} />
						<span>Trinkets</span>
					</>
				),
			},
		},
		{
			id: "friends",
			col: 1,
			row: 3,
			colSpan: 2,
			keycapProps: {
				colour: "blue",
				legend: "⬤",
				isActive: location.pathname === "/friends",
				onPress: () => navigate("/friends"),
				children: (
					<>
						<FriendsIcon size={20} />
						<span>Friends</span>
					</>
				),
			},
		},
		{
			id: "chatter",
			col: 1,
			row: 4,
			colSpan: 2,
			keycapProps: {
				colour: "red",
				legend: "⬤",
				isActive: location.pathname === "/chatter",
				onPress: () => navigate("/chatter"),
				children: (
					<>
						<ChatterIcon size={20} />
						<span>Chatter</span>
					</>
				),
			},
		},
	];

	return (
		<KeyboardLayout
			keys={navKeys}
			columns={1}
			rows={4}
			plateColor="var(--dark)"
		/>
	);
}
