import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const r2 = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage/com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY_ID!,
	},
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

export async function deleteFromR2Service(fileURL: string): Promise<void> {
	const key = extractKeyFromURL(fileURL);
	await r2.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
}

// ================= HELPERS ==================

function extractKeyFromURL(fileURL: string) {
	const url = new URL(fileURL);
	return url.pathname.slice(1);
}
