import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { KeyboardLayout } from "./KeyboardLayout";
import type { KeyPosition } from "./KeyboardLayout";
import { IslandIcon, TrinketsIcon, FriendsIcon, ChatterIcon } from "./icons";
import type { RootState } from "../../app/store";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { ArrowIcon } from "./icons/ArrowIcon";

interface KeycapNavProps {
	isExpanded?: boolean;
	onToggleExpand?: () => void;
	hasSlotContent?: boolean;
}

export function KeycapNav({ isExpanded, onToggleExpand, hasSlotContent }: KeycapNavProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const username = useSelector((state: RootState) => state.auth.user!.username);
	const isMobile = useMediaQuery("(max-width: 768px)");

	const desktopKeys: KeyPosition[] = [
		{
			id: "islandIcon",
			col: 1,
			row: 1,
			colSpan: 1,
			keycapProps: {
				colour: "yellow",
				isActive: location.pathname.startsWith(`/${username}`),
				onPress: () => navigate(`/${username}/chatter`),
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
				isHighlighted: location.pathname.startsWith(`/${username}`),
				onPress: () => navigate(`/${username}/chatter`),
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
				isActive: location.pathname.startsWith("/trinkets"),
				onPress: () => navigate("/trinkets/self"),
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
				isHighlighted: location.pathname.startsWith("/trinkets"),
				onPress: () => navigate("/trinkets/self"),
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
				isActive: location.pathname.startsWith("/friends"),
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
				isHighlighted: location.pathname.startsWith("/friends"),
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
				isActive: location.pathname.startsWith("/chatter"),
				onPress: () => navigate("/chatter/unread"),
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
				isHighlighted: location.pathname.startsWith("/chatter"),
				onPress: () => navigate("/chatter/unread"),
				children: "Chatter",
			},
		},
	];

	const mobileKeys: KeyPosition[] = [
		{
			id: "islandIcon",
			col: 1,
			row: 1,
			colSpan: 1,
			keycapProps: {
				colour: "yellow",
				isActive: location.pathname.startsWith(`/${username}`),
				onPress: () => navigate(`/${username}/chatter`),
				children: <IslandIcon size={22} />,
			},
		},
		{
			id: "trinketsIcon",
			col: 2,
			row: 1,
			colSpan: 1,
			keycapProps: {
				colour: "green",
				isActive: location.pathname.startsWith("/trinkets"),
				onPress: () => navigate("/trinkets/self"),
				children: <TrinketsIcon size={22} />,
			},
		},
		{
			id: "friendsIcon",
			col: 3,
			row: 1,
			colSpan: 1,
			keycapProps: {
				colour: "blue",
				isActive: location.pathname.startsWith("/friends"),
				onPress: () => navigate("/friends"),
				children: <FriendsIcon size={22} />,
			},
		},
		{
			id: "chatterIcon",
			col: 4,
			row: 1,
			colSpan: 1,
			keycapProps: {
				colour: "red",
				isActive: location.pathname.startsWith("/chatter"),
				onPress: () => navigate("/chatter"),
				children: <ChatterIcon size={22} />,
			},
		},
		{
			id: "widgetToggle",
			col: 5,
			row: 1,
			keycapProps: {
				colour: "charcoal",
				isActive: isExpanded && hasSlotContent,
				disabled: !hasSlotContent,
				onRelease: onToggleExpand,
				children: (
					<div
						style={{
							transform: isExpanded && hasSlotContent ? "rotate(180deg)" : "none",
						}}>
						<ArrowIcon size={22} />
					</div>
				),
			},
		},
	];

	return (
		<KeyboardLayout
			keys={isMobile ? mobileKeys : desktopKeys}
			columns={isMobile ? 5 : 3}
			rows={isMobile ? 1 : 4}
			plateColor="var(--dark)"
		/>
	);
}
