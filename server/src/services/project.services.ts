import db from "../config/db";
import { CONFLICT } from "../constants/http";
import {
  CreateProjectSchemaType,
  GetAllProjectsSchemaType,
} from "../schemas/project.schema";
import appAssert from "../utils/appAssert";
import { buildFolderTree, NestedProject } from "../utils/buildFolderTree";
import { buildProjectTree } from "../utils/buildProjectTree";

export const createProject = async (
  projectData: CreateProjectSchemaType,
  userId: string
) => {
  const { projectName, projectDescription } = projectData;

  // Check if project name already exists for the user
  const existingProject = await db.project.findFirst({
    where: {
      name: projectName,
      ownerId: userId,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  appAssert(
    !existingProject,
    CONFLICT,
    "Project with this name already exists...."
  );

  // Transaction to create a Project and UserProjectSettings
  const result = await db.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        name: projectName,
        description: projectDescription,
        ownerId: userId,
      },
    });

    //TODO: Add project member and userProjectSettings
    await tx.projectMember.create({
      data: {
        projectId: project.id,
        userId: userId,
        role: "ADMIN",
      },
    });

    await tx.userProjectSettings.create({
      data: {
        userId: userId,
        projectId: project.id,
        isArchived: false,
        isFavorite: false,
      },
    });

    return { project };
  });

  return { project: result.project };
};

export const getAllProjects = async (
  userId: string,
  queries: GetAllProjectsSchemaType
) => {
  const { search = "", page = 1, limit = 10, tag = "" } = queries;

  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    ...(tag && {
      tags: {
        some: {
          tag: {
            text: {
              contains: tag,
            },
            userId,
          },
        },
      },
    }),

    OR: [
      { ownerId: userId },
      { members: { some: { userId } } },
      {
        userSettings: {
          some: { userId, isArchived: false },
        },
      },
    ],
    ...(search && {
      name: {
        contains: search,
      },
    }),
  };

  const [projectsRaw, totalCount] = await Promise.all([
    db.project.findMany({
      skip,
      take: limit,
      where: where,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        owner: {
          select: {
            id: true,
            imageUrl: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        userSettings: {
          select: {
            isFavorite: true,
          },
        },
        members: {
          select: {
            id: true,
            role: true,
            userId: true,
            user: {
              select: {
                imageUrl: true,
                email: true,
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                text: true,
                color: true,
              },
            },
          },
        },
      },
    }),
    db.project.count({
      where,
    }),
  ]);

  const projects = projectsRaw.map((project) => ({
    ...project,
    tags: project.tags.map((t) => t.tag),
  }));

  return { projects, totalCount, page, limit };
};

export const getFiveProject = async (searchTerm: string, userId: string) => {
  const projects = await db.project.findMany({
    take: 5,
    where: {
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      folders: {
        select: {
          id: true,
          name: true,
          parentFolderId: true,
        },
      },
      documents: {
        select: {
          id: true,
          title: true,
          folderId: true,
        },
      },
    },
  });

  const nestedProjects: NestedProject[] = projects.map((proj) => ({
    id: proj.id,
    name: proj.name,
    documents: proj.documents,
    folders: buildFolderTree(proj.folders, proj.documents, null),
  }));

  return { nestedProjects };
};

export const getProjectById = async (projectId: string, userId: string) => {
  const project = await db.project.findUnique({
    where: {
      id: projectId,
      members: { some: { userId } },
    },
    select: {
      id: true,
      name: true,
      description: true,
      updatedAt: true,
      deletedAt: true,
      createdAt: true,
      userSettings: {
        where: { userId },
        select: { isFavorite: true },
      },
      members: {
        where: { userId },
        select: { role: true },
      },
      folders: {
        where: { deletedAt: null },
        select: { id: true, name: true, parentFolderId: true },
        orderBy: { name: "asc" },
      },
      documents: {
        where: {
          deletedAt: null,
          OR: [{ folderId: null }, { folder: { deletedAt: null } }],
        },
        select: { id: true, title: true, folderId: true },
        orderBy: { title: "asc" },
      },
    },
  });

  appAssert(
    project && !project.deletedAt,
    404,
    "Project not found or you don't have access"
  );

  const projectTree = buildProjectTree(project.folders, project.documents);

  // Add root-level documents (those without a folder)
  const rootDocuments = project.documents
    .filter((doc) => doc.folderId === null)
    .map((doc) => ({
      id: doc.id,
      name: doc.title,
      type: "file" as const,
    }));

  return {
    project: {
      id: project.id,
      name: project.name,
      description: project.description,
      deletedAt: project.deletedAt,
      updatedAt: project.updatedAt,
      createdAt: project.createdAt,
      role: project.members[0]?.role,
      isFavorite: project.userSettings[0]?.isFavorite || false,
    },
    projectTree: [...projectTree, ...rootDocuments],
  };
};
