import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ServerError, ServerErrorCode } from "../errors/ServerError.ts";

const r2 = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

const MAX_SIZES: Record<string, number> = {
	user_photograph: 3 * 1024 * 1024,
	user_seal: 3 * 1024 * 1024,
	island_cover: 5 * 1024 * 1024,
	post_media: 10 * 1024 * 1024,
	trinket_cover: 5 * 1024 * 1024,
	trinket_item_media: 10 * 1024 * 1024,
};

const ALLOWED_TYPES: Record<string, string[]> = {
	user_photograph: ["image/jpeg", "image/png", "image/webp"],
	user_seal: ["image/jpeg", "image/png", "image/webp"],
	island_cover: ["image/jpeg", "image/png", "image/webp"],
	post_media: ["image/jpeg", "image/png", "video/mp4", "audio/mpeg"],
	trinket_cover: ["image/jpeg", "image/png", "image/webp"],
	trinket_item_media: ["image/jpeg", "image/png", "video/mp4", "audio/mpeg"],
};

export async function signUploadService(
	userId: number,
	category: string,
	contentType: string,
	fileSizeBytes: number,
): Promise<{ uploadURL: string; publicURL: string }> {
	const maxSize = MAX_SIZES[category];
	const allowedTypes = ALLOWED_TYPES[category];
	if (!maxSize || !allowedTypes)
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "signUploadService");
	if (!allowedTypes.includes(contentType))
		throw new ServerError(ServerErrorCode.INVALID_INPUT, "signUploadService");
	if (fileSizeBytes > maxSize)
		throw new ServerError(ServerErrorCode.PAYLOAD_TOO_LARGE, "signUploadService");

	const key = `${category}/${userId}/${crypto.randomUUID()}`;

	const command = new PutObjectCommand({
		Bucket: process.env.R2_BUCKET_NAME!,
		Key: key,
		ContentType: contentType,
		ContentLength: fileSizeBytes,
	});

	const uploadURL = await getSignedUrl(r2, command, { expiresIn: 300 });

	const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
	if (!publicBase) throw new ServerError(ServerErrorCode.INTERNAL_ERROR, "signUploadService");
	const publicURL = `${publicBase}/${key}`;

	return { uploadURL, publicURL };
}

export async function deleteFromR2Service(fileURL: string): Promise<void> {
	const key = extractKeyFromURL(fileURL);
	await r2.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
}

// ================= HELPERS ==================

function extractKeyFromURL(fileURL: string) {
	const url = new URL(fileURL);
	return url.pathname.slice(1);
}
