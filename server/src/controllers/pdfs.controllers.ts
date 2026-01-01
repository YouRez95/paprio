import { GetObjectCommand } from "@aws-sdk/client-s3";
import db from "../config/db";
import { FORBIDDEN, NOT_FOUND } from "../constants/http";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import { streamToResponse } from "../utils/streamHelpers";
import { r2Client } from "../config/r2";

export const getPdfProxyHandler = catchErrors(async (req, res) => {
  const { documentId } = req.params;
  const { download } = req.query;
  const userId = req.userId;

  // STEP 1: Get document and verify it exists
  const document = await db.document.findFirst({
    where: { id: documentId, deletedAt: null },
    include: {
      project: { select: { id: true, ownerId: true } },
    },
  });

  appAssert(document, NOT_FOUND, "Document not found");

  // STEP 2: Verify user has access
  const isOwner = document.project.ownerId === userId;
  const member = await db.projectMember.findFirst({
    where: { projectId: document.projectId, userId },
  });
  const hasAccess = isOwner || !!member;
  appAssert(hasAccess, FORBIDDEN, "You do not have access to this document");

  // STEP 3: Check if PDF exists
  if (!document.pdfR2Key) {
    return res.status(404).json({
      status: "error",
      message: "PDF not generated yet",
    });
  }

  try {
    // STEP 4: Fetch PDF from R2
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: document.pdfR2Key,
    });

    const response = await r2Client.send(command);

    if (!response.Body) {
      throw new Error("PDF body is empty");
    }

    // STEP 5: Set response headers
    res.setHeader("Content-Type", "application/pdf");

    // Change Content-Disposition based on download parameter
    const disposition = download === "true" ? "attachment" : "inline";
    res.setHeader(
      "Content-Disposition",
      `${disposition}; filename="${encodeURIComponent(document.title)}.pdf"`
    );

    res.setHeader("X-Content-Type-Options", "nosniff");

    if (response.ContentLength) {
      res.setHeader("Content-Length", response.ContentLength);
    }

    // STEP 6: Stream PDF to response using helper function
    await streamToResponse(response.Body, res);
  } catch (error) {
    console.error("Error fetching PDF from R2:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch PDF",
      });
    }
  }
});

export const getPdfVersionProxyHandler = catchErrors(async (req, res) => {
  const { documentId } = req.params;
  const { download } = req.query;
  const userId = req.userId;
  const { versionId } = req.params;

  // STEP 1: Get document version and verify it exists
  const documentVersion = await db.documentVersion.findUnique({
    where: { id: versionId },
    include: {
      document: {
        include: {
          project: { select: { id: true, ownerId: true } },
        },
      },
    },
  });

  appAssert(documentVersion, NOT_FOUND, "Document not found");

  // STEP 2: Verify user has access
  const isOwner = documentVersion.document.project.ownerId === userId;
  const member = await db.projectMember.findFirst({
    where: { projectId: documentVersion.document.projectId, userId },
  });
  const hasAccess = isOwner || !!member;
  appAssert(hasAccess, FORBIDDEN, "You do not have access to this document");

  // STEP 3: Check if PDF exists
  if (!documentVersion.pdfR2Key) {
    return res.status(404).json({
      status: "error",
      message: "PDF not generated yet",
    });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: documentVersion.pdfR2Key,
    });

    const response = await r2Client.send(command);

    if (!response.Body) {
      throw new Error("PDF body is empty");
    }

    // STEP 5: Set response headers
    res.setHeader("Content-Type", "application/pdf");

    // Change Content-Disposition based on download parameter
    const disposition = download === "true" ? "attachment" : "inline";
    res.setHeader(
      "Content-Disposition",
      `${disposition}; filename="${encodeURIComponent(
        documentVersion.title
      )}.pdf"`
    );

    res.setHeader("X-Content-Type-Options", "nosniff");

    if (response.ContentLength) {
      res.setHeader("Content-Length", response.ContentLength);
    }

    // STEP 6: Stream PDF to response using helper function
    await streamToResponse(response.Body, res);
  } catch (error) {
    console.error("Error fetching PDF from R2:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        status: "error",
        message: "Failed to fetch PDF",
      });
    }
  }
});
