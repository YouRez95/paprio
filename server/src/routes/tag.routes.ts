import Router from "express";
import {
  createTagsHandler,
  getAllTagsHandler,
  toggleTagHandler,
} from "../controllers/tag.controllers";

const tagRoutes = Router();

// Prefix: /api/v1/tags

tagRoutes.get("/", getAllTagsHandler);

tagRoutes.post("/create", createTagsHandler);

tagRoutes.post("/toggle", toggleTagHandler);

export default tagRoutes;
