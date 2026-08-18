import type { HTMLAttributes, ReactNode } from "react";

export type Colours = "yellow" | "green" | "blue" | "red" | "cream" | "dark";

interface Props extends HTMLAttributes<HTMLButtonElement> {
	colour?: Colours;
	icon?: ReactNode;
}

export function TactileButton({ colour = "cream", icon, children, className, ...rest }: Props) {
	return (
		<button
			className={`tactile ${colour} ${className ?? ""}`}
			{...rest}>
			{icon}
			{children}
		</button>
	);
}
