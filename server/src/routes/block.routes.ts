import { Router } from "express";
import {
  getBlockByIdHandler,
  getBlocksByTypeHandler,
} from "../controllers/block.controllers";

const blockRoutes = Router();
// prefix:  /api/v1/blocks

// get blocks by their type
blockRoutes.get("/:type", getBlocksByTypeHandler);

//get configSchema for specific block
blockRoutes.get("/block/:blockId", getBlockByIdHandler);

export default blockRoutes;
