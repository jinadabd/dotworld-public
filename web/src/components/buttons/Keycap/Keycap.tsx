import { useMemo } from "react";
import { useKeycapPress } from "../../../hooks/useKeycapPress";
import { buildSideGradient } from "./gradients";
import type { KeycapProps } from "./Keycap.types";
import styles from "./Keycap.module.css";
export function Keycap({
	variant = "cream",
	colour = "cream",
	size = "1u",
	children,
	legend,
	onPress,
	onRelease,
	disabled = false,
	className,
	faceColor,
	sideColor,
	isActive = false,
	isHighlighted = false,
	...rest
}: KeycapProps) {
	const handlePress = onPress;
	const { buttonProps } = useKeycapPress({ onPress: handlePress, onRelease, disabled });

	const resolvedVariant = isActive ? colour : "cream";
	const sideGradient = useMemo(
		() => buildSideGradient(resolvedVariant, size),
		[resolvedVariant, size],
	);

	const customStyle =
		variant === "custom"
			? ({
					"--custom-face": faceColor,
					"--custom-side": sideColor,
					...rest.style,
				} as React.CSSProperties)
			: sideGradient
				? { background: sideGradient, ...rest.style }
				: rest.style;

	return (
		<button
			className={`${styles.keycap}${className ? ` ${className}` : ""}`}
			data-variant={resolvedVariant}
			data-color={colour}
			data-size={size}
			data-disabled={disabled || undefined}
			data-active={isActive || undefined}
			data-highlighted={isHighlighted || undefined}
			style={customStyle}
			disabled={disabled}
			onClick={onPress}
			{...rest}
			{...buttonProps}>
			{legend && <span className={styles.legend}>{legend}</span>}
			<span className={styles.content}>{children}</span>
		</button>
	);
}
