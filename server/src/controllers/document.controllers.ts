import { CREATED, FORBIDDEN, NOT_FOUND } from "../constants/http";
import {
  CompileDocumentSchema,
  CreateDocumentSchema,
  createDocumentVersionSchema,
  UpdateDocumentNameSchema,
} from "../schemas/document.schema";
import {
  compileDocument,
  createDocument,
  createDocumentVersion,
  getDocumentById,
  getDocumentVersions,
  updateDocumentName,
} from "../services/document.services";
import catchErrors from "../utils/catchErrors";

export const createDocumentHandler = catchErrors(async (req, res) => {
  // Validate the request body
  const validationResult = CreateDocumentSchema.parse(req.body);
  const userId = req.userId;

  const { documentCreated } = await createDocument({
    ...validationResult,
    userId,
  });

  return res.status(CREATED).json({
    status: "success",
    message: "Document created successfully",
    data: documentCreated,
  });
});

export const updateDocumentNameHandler = catchErrors(async (req, res) => {
  // Validate the request body
  const validationResult = UpdateDocumentNameSchema.parse(req.body);
  const documentId = req.params.documentId;
  const userId = req.userId;

  const { documentUpdated } = await updateDocumentName({
    ...validationResult,
    documentId,
    userId,
  });

  return res.status(CREATED).json({
    status: "success",
    message: "Document updated successfully",
    data: documentUpdated,
  });
});

export const getDocumentByIdHandler = catchErrors(async (req, res) => {
  const { documentId } = req.params;
  const userId = req.userId;

  const { document } = await getDocumentById(documentId, userId);

  return res.status(200).json({
    status: "success",
    message: "Document fetched successfully",
    data: document,
  });
});

export const compileDocumentHandler = catchErrors(async (req, res) => {
  const { documentId } = req.params;
  const userId = req.userId;

  // Validate the body
  const validationResult = CompileDocumentSchema.parse(req.body);

  const { size, success, expiresIn, pdfBuffer, pdfUrl } = await compileDocument(
    {
      documentId,
      userId,
      blocks: validationResult,
    }
  );

  return res.status(200).json({
    status: "success",
    message: "Document compiled successfully",
    data: {
      size,
      success,
      expiresIn,
      pdfUrl,
      pdfBuffer,
    },
  });
});

export const createDocumentVersionHandler = catchErrors(async (req, res) => {
  const { documentId } = req.params;
  const { note } = createDocumentVersionSchema.parse(req.body);
  const userId = req.userId;

  const { version } = await createDocumentVersion({ documentId, userId, note });

  return res.status(201).json({
    status: "success",
    message: "Document version created successfully",
    data: {
      version,
    },
  });
});

export const getDocumentVersionsHandler = catchErrors(async (req, res) => {
  const { documentId } = req.params;
  const userId = req.userId;

  const { versions } = await getDocumentVersions({ documentId, userId });

  return res.status(200).json({
    status: "success",
    message: "Document versions fetched successfully",
    data: versions,
  });
});
