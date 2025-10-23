import { Router } from "express";
import {
  createFolderHandler,
  deleteFolderOrFileHandler,
  renameFolderOrFileHandler,
} from "../controllers/folder.controllers";

const folderRoutes = Router();
// prefix:  /api/v1/folders

// Create a new folder
folderRoutes.post("/create", createFolderHandler);

// Rename a folder or file
folderRoutes.patch("/rename/:id", renameFolderOrFileHandler);

// Update deleteAt timestamp to soft delete a folder or file
folderRoutes.patch("/soft-delete/:id", deleteFolderOrFileHandler);

export default folderRoutes;
