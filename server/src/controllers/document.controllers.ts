import { CREATED } from "../constants/http";
import { CreateDocumentSchema } from "../schemas/document.schema";
import { createDocument } from "../services/document.services";
import catchErrors from "../utils/catchErrors";

export const createDocumentHandler = catchErrors(async (req, res) => {
  // Validate the request body
  const validationResult = CreateDocumentSchema.parse(req.body);

  const { documentCreated } = await createDocument(validationResult);

  return res.status(CREATED).json({
    status: "success",
    message: "Document created successfully",
    data: documentCreated,
  });
});
