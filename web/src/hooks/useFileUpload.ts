import { useState } from "react";
import { useSignUploadMutation } from "../features/uploads/uploadApi";

export function useFileUpload() {
	const [signUpload] = useSignUploadMutation();
	const [isUploading, setIsUploading] = useState(false);

	async function upload(file: File, category: string): Promise<string> {
		setIsUploading(true);
		try {
			const { uploadURL, publicURL } = await signUpload({
				category,
				contentType: file.type,
				fileSizeBytes: file.size,
			}).unwrap();

			const putResponse = await fetch(uploadURL, {
				method: "PUT",
				body: file,
				headers: { "Content-Type": file.type },
			});

			if (!putResponse.ok) throw new Error("Upload to storage failed.");

			return publicURL;
		} finally {
			setIsUploading(false);
		}
	}

	return { upload, isUploading };
}
