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
			id: "islandIcon",
			col: 1,
			row: 1,
			colSpan: 1,
			keycapProps: {
				colour: "yellow",
				isActive: location.pathname === `/${username}`,
				onPress: () => navigate(`/${username}`),
				children: <IslandIcon size={25} />,
			},
		},
		{
			id: "islandLabel",
			col: 2,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "yellow",
				legend: "⬤",
				isHighlighted: location.pathname === `/${username}`,
				onPress: () => navigate(`/${username}`),
				children: "Island",
			},
		},
		{
			id: "trinketsIcon",
			col: 1,
			row: 2,
			colSpan: 1,
			keycapProps: {
				colour: "green",
				isActive: location.pathname === "/trinkets",
				onPress: () => navigate("/trinkets"),
				children: <TrinketsIcon size={25} />,
			},
		},
		{
			id: "trinketsLabel",
			col: 2,
			row: 2,
			colSpan: 2,
			keycapProps: {
				colour: "green",
				legend: "⬤",
				isHighlighted: location.pathname === "/trinkets",
				onPress: () => navigate("/trinkets"),
				children: "Trinkets",
			},
		},
		{
			id: "friendsIcon",
			col: 1,
			row: 3,
			colSpan: 1,
			keycapProps: {
				colour: "blue",
				isActive: location.pathname === "/friends",
				onPress: () => navigate("/friends"),
				children: <FriendsIcon size={25} />,
			},
		},
		{
			id: "friendsLabel",
			col: 2,
			row: 3,
			colSpan: 2,
			keycapProps: {
				colour: "blue",
				legend: "⬤",
				isHighlighted: location.pathname === "/friends",
				onPress: () => navigate("/friends"),
				children: "Friends",
			},
		},
		{
			id: "chatterIcon",
			col: 1,
			row: 4,
			colSpan: 1,
			keycapProps: {
				colour: "red",
				isActive: location.pathname === "/chatter",
				onPress: () => navigate("/chatter"),
				children: <ChatterIcon size={25} />,
			},
		},
		{
			id: "chatterLabel",
			col: 2,
			row: 4,
			colSpan: 2,
			keycapProps: {
				colour: "red",
				legend: "⬤",
				isHighlighted: location.pathname === "/chatter",
				onPress: () => navigate("/chatter"),
				children: "Chatter",
			},
		},
	];

	return (
		<KeyboardLayout
			keys={navKeys}
			columns={2}
			rows={4}
			plateColor="var(--dark)"
		/>
	);
}
