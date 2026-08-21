export type KeycapSize = "1u" | "1.25u" | "1.5u" | "2u" | "2u-v" | "3u";

// export type KeycapVariant = "cream" | "charcoal" | "custom";
export type KeycapVariant = "cream" | "yellow" | "green" | "blue" | "red" | "charcoal" | "custom";

export interface KeycapProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: KeycapVariant;
	colour?: KeycapVariant;
	size?: KeycapSize;
	children?: React.ReactNode;
	legend?: string;
	onPress?: () => void;
	onRelease?: () => void;
	disabled?: boolean;
	className?: string;
	faceColor?: string;
	sideColor?: string;
	href?: string;
	isActive?: boolean;
	isHighlighted?: boolean;
}
