import { Router } from "express";
import express from "express";
import {
  compileDocumentHandler,
  createDocumentHandler,
  createDocumentVersionHandler,
  getDocumentByIdHandler,
  getDocumentVersionsHandler,
  updateDocumentNameHandler,
} from "../controllers/document.controllers";

const documentRoutes = Router();
// prefix:  /api/v1/documents

// Create a new document
documentRoutes.post("/create", createDocumentHandler);

// Update the document name
documentRoutes.post("/update-name/:documentId", updateDocumentNameHandler);

// Get the full document by ID
documentRoutes.get("/full/:documentId", getDocumentByIdHandler);

// Compile the document and return the pdf url
documentRoutes.post(
  "/compile/:documentId",
  express.text({ type: "*/*" }),
  (req, res, next) => {
    try {
      req.body = JSON.parse(req.body);
    } catch {}
    next();
  },
  compileDocumentHandler
);

// Create a version snapshot of the current document
documentRoutes.post("/version/:documentId", createDocumentVersionHandler);

documentRoutes.get("/versions/:documentId", getDocumentVersionsHandler);
export default documentRoutes;
