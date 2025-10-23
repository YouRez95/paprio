import Router from "express";
import {
  createProjectHandler,
  getAllProjectsHandler,
  getFiveProjectsHandler,
  getProjectByIdHandler,
} from "../controllers/project.controllers";

const projectRoutes = Router();

// Prefix: /api/v1/projects

// Create a new project
projectRoutes.post("/create", createProjectHandler);

// Get all projects
projectRoutes.get("/", getAllProjectsHandler);

// Get five projects (for dashboard)
projectRoutes.get("/five/search", getFiveProjectsHandler);

// Get a single project by ID
projectRoutes.get("/single/:projectId", getProjectByIdHandler);

export default projectRoutes;
