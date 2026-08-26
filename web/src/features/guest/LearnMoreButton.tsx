// import styles from "./TactileButton.module.css";
import { useNavigate } from "react-router-dom";
import { KeyboardLayout, type KeyPosition } from "../../components/buttons/KeyboardLayout";

export function LandingButtons() {
	const handleAboutScroll = () => {
		const aboutSection = document.getElementById("about");
		if (aboutSection) {
			aboutSection.scrollIntoView({ behavior: "smooth" });
		}
	};

	const navigate = useNavigate();
	const buttonKey: KeyPosition[] = [
		{
			id: "aboutButton",
			col: 1,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "cream",
				legend: "⬤",
				onRelease: handleAboutScroll,
				children: "About",
			},
		},
		{
			id: "getstartedButton",
			col: 3,
			row: 1,
			colSpan: 3,
			keycapProps: {
				colour: "yellow",
				legend: "⬤",
				onRelease: () => navigate("/signup"),
				children: "Get Started",
			},
		},
	];

	return (
		<KeyboardLayout
			keys={buttonKey}
			columns={2}
			rows={1}
			plateColor="#272727"
		/>
	);
}
