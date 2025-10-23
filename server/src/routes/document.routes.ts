import { Router } from "express";
import { createDocumentHandler } from "../controllers/document.controllers";

const documentRoutes = Router();
// prefix:  /api/v1/documents
documentRoutes.post("/create", createDocumentHandler);

export default documentRoutes;
