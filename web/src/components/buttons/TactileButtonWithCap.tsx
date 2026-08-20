import type { ButtonHTMLAttributes, ReactNode } from "react";
import { TactileButton, type Colours } from "./TactileButton";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	colour?: Colours;
	icon?: ReactNode;
	active?: boolean;
}

export function TactileButtonWithCap(props: Props) {
	return <TactileButton {...props} />;
}
