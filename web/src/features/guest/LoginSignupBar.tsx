import type { ButtonHTMLAttributes } from "react";
import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	activeTab: string;
	setActiveTab: (tab: "signup" | "login") => void;
}

export function LoginSignupBar({ activeTab, setActiveTab }: Props) {
	const navKeys: KeyPosition[] = [
		{
			id: "signupTab",
			col: 1,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "yellow",
				isActive: activeTab === "signup",
				onRelease: () => setActiveTab("signup"),
				children: "Signup",
			},
		},
		{
			id: "loginTab",
			col: 3,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "yellow",
				isActive: activeTab === "login",
				onRelease: () => setActiveTab("login"),
				children: "Login",
			},
		},
	];

	return (
		<KeyboardLayout
			keys={navKeys}
			columns={2}
			rows={1}
			plateColor="#272727"
		/>
	);
}
