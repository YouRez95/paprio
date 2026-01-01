import { CREATED, OK } from "../constants/http";
import {
  CreateProjectSchema,
  GetAllProjectsSchema,
} from "../schemas/project.schema";
import {
  createProject,
  getAllProjects,
  getFiveProject,
  getProjectById,
} from "../services/project.services";
import catchErrors from "../utils/catchErrors";

export const createProjectHandler = catchErrors(async (req, res) => {
  // Validate the request body
  const validationResult = CreateProjectSchema.parse(req.body);

  // Create the project
  const { project } = await createProject(validationResult, req.userId);

  // Send the response
  return res.status(CREATED).json({
    status: "success",
    message: "Project created successfully",
    data: project,
  });
});

export const getAllProjectsHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  const queries = GetAllProjectsSchema.parse(req.query);
  const { projects, totalCount, page, limit } = await getAllProjects(
    userId,
    queries
  );

  return res.status(200).json({
    status: "success",
    message: "Projects retrieved successfully",
    data: {
      projects,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    },
  });
});

export const getFiveProjectsHandler = catchErrors(async (req, res) => {
  const searchTerm = (req.query.search || "") as string;
  const userId = req.userId;

  const { nestedProjects } = await getFiveProject(searchTerm, userId);

  return res.status(OK).json({
    status: "success",
    message: "Five projects retrieved successfully",
    data: nestedProjects,
  });
});

export const getProjectByIdHandler = catchErrors(async (req, res) => {
  const { projectId } = req.params;
  const userId = req.userId;

  const { project, projectTree } = await getProjectById(projectId, userId);

  return res.status(OK).json({
    status: "success",
    message: "Project retrieved successfully",
    data: { project, projectTree },
  });
});
