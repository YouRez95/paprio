import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { R2_ACCOUNT_ID, R2_BUCKET_NAME } from "../constants/env";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = R2_BUCKET_NAME;

/**
 * Generate R2 storage key for a document PDF
 */
export const generateR2Key = (
  projectId: string,
  documentId: string,
  version?: number
): string => {
  if (version !== undefined) {
    return `projects/${projectId}/documents/${documentId}/versions/${version}.pdf`;
  }
  return `projects/${projectId}/documents/${documentId}/latest.pdf`;
};

/**
 * Upload PDF buffer to R2
 */
export const uploadPdfToR2 = async (
  pdfBuffer: Buffer,
  projectId: string,
  documentId: string,
  version?: number
): Promise<{ r2Key: string; size: number }> => {
  const r2Key = generateR2Key(projectId, documentId, version);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: r2Key,
    Body: pdfBuffer,
    ContentType: "application/pdf",
    Metadata: {
      projectId,
      documentId,
      ...(version !== undefined && { version: version.toString() }),
      uploadedAt: new Date().toISOString(),
    },
  });

  await r2Client.send(command);

  return {
    r2Key,
    size: pdfBuffer.length,
  };
};

/**
 * Generate a signed URL for downloading a PDF (expires in specified seconds)
 */
export const generateSignedPdfUrl = async (
  r2Key: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: r2Key,
  });

  const signedUrl = await getSignedUrl(r2Client, command, {
    expiresIn,
  });

  return signedUrl;
};

/**
 * Delete a PDF from R2
 */
export const deletePdfFromR2 = async (r2Key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: r2Key,
  });

  await r2Client.send(command);
};

/**
 * Delete all versions of a document from R2
 */
export const deleteDocumentPdfsFromR2 = async (
  projectId: string,
  documentId: string,
  versions: number[]
): Promise<void> => {
  const deletePromises = [
    // Delete latest PDF
    deletePdfFromR2(generateR2Key(projectId, documentId)),
    // Delete all version PDFs
    ...versions.map((version) =>
      deletePdfFromR2(generateR2Key(projectId, documentId, version))
    ),
  ];

  await Promise.allSettled(deletePromises);
};
