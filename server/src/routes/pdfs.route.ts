import { Router } from "express";
import {
  getPdfProxyHandler,
  getPdfVersionProxyHandler,
} from "../controllers/pdfs.controllers";
import { fetchUserMiddlewareForPdf } from "../middleware/fetchUserMiddelware";

const pdfRoutes = Router();
// prefix:  /api/v1/pdfs

pdfRoutes.get(
  "/read/:documentId",
  fetchUserMiddlewareForPdf,
  getPdfProxyHandler
);

pdfRoutes.get(
  "/version/read/:documentId/:versionId",
  fetchUserMiddlewareForPdf,
  getPdfVersionProxyHandler
);

export default pdfRoutes;
