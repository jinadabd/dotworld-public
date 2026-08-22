import { useRef } from "react";
import { TactileButton } from "./TactileButton";
import { KeyboardLayout, type KeyPosition } from "./KeyboardLayout";

interface FileUploadButtonProps {
	onFileSelect: (file: File | null) => void;
	selectedFile: File | null;
	accept?: string;
}

export function FileUploadButton({
	onFileSelect,
	selectedFile,
	accept = "image/*, video/*, audio/*",
}: FileUploadButtonProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleClick = (e?: React.MouseEvent) => {
		e?.preventDefault();
		fileInputRef.current?.click();
	};

	const buttonKey: KeyPosition[] = [
		{
			id: "clearButton",
			col: 1,
			row: 1,
			colSpan: 1,
			keycapProps: {
				colour: "cream",
				disabled: selectedFile === null,
				onPress: () => onFileSelect(null),
				onRelease: () => onFileSelect(null),
				children: (
					<span
						style={{
							fontFamily: "Bitcount",
							fontSize: "2rem",
							transform: "rotate(45deg)",
						}}>
						+
					</span>
				),
			},
		},
		{
			id: "uploadButton",
			col: 2,
			row: 1,
			colSpan: 2,
			keycapProps: {
				colour: "cream",
				legend: "⬤",
				isHighlighted: selectedFile !== null,
				onPress: handleClick,
				onRelease: handleClick,
				children: selectedFile !== null ? "Attached" : "Upload",
			},
		},
	];

	return (
		<>
			<input
				ref={fileInputRef}
				type="file"
				accept={accept}
				style={{ display: "none" }}
				onChange={(e) => onFileSelect(e.target.files?.[0] ?? null)}
			/>
			<KeyboardLayout
				keys={buttonKey}
				columns={1}
				rows={1}
				plateColor="#272727"
			/>
		</>
	);
}
