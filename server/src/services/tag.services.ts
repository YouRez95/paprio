import db from "../config/db";
import { CONFLICT } from "../constants/http";
import {
  CreateTagSchemaType,
  ToggleTagSchemaType,
} from "../schemas/tag.schema";
import appAssert from "../utils/appAssert";

export const getAllTags = async (userId: string) => {
  const tags = await db.tag.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      text: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { tags };
};

export const createTag = async (
  userId: string,
  tagData: CreateTagSchemaType
) => {
  // Check if the tag already exist
  const existingTag = await db.tag.findFirst({
    where: {
      text: tagData.tagName,
      userId: userId,
    },
    select: {
      id: true,
    },
  });

  appAssert(!existingTag, CONFLICT, "Tag with this name already exists...");

  // Create the tag
  const tag = await db.tag.create({
    data: {
      text: tagData.tagName,
      color: tagData.color,
      userId: userId,
    },
  });

  // If projectIds are provided, associate the tag with those projects
  if (tagData.projectIds && tagData.projectIds.length > 0) {
    await db.projectTag.createMany({
      data: tagData.projectIds.map((projectId) => ({
        projectId,
        tagId: tag.id,
      })),
    });
  }

  return { tag };
};

export const toggleTag = async (data: ToggleTagSchemaType, userId: string) => {
  const { projectIds, tagId, type } = data;

  // Check if the tag exists
  const tag = await db.tag.findUnique({
    where: {
      id: tagId,
      userId: userId,
    },
    select: {
      id: true,
      text: true,
      color: true,
    },
  });

  appAssert(tag, CONFLICT, "Tag does not exist...");

  // Retrieve all projects by projectsIds
  const projects = await db.project.findMany({
    where: {
      id: { in: [...new Set(projectIds)] },
      deletedAt: null,
      userSettings: {
        some: {
          userId: userId,
          isArchived: false,
        },
      },
    },
    select: {
      id: true,
      name: true,
      tags: {
        where: {
          tagId: tagId,
        },
        select: {
          tagId: true,
        },
      },
    },
  });

  const projectsToUpdate = {
    add: [] as string[],
    remove: [] as string[],
  };

  for (const project of projects) {
    const hasTag = project.tags.length > 0;

    if (type === "add" && !hasTag) {
      projectsToUpdate.add.push(project.id);
    }

    if (type === "remove" && hasTag) {
      projectsToUpdate.remove.push(project.id);
    }
  }

  if (projectsToUpdate.add.length > 0) {
    await db.projectTag.createMany({
      data: projectsToUpdate.add.map((projectId) => ({
        projectId,
        tagId: tag.id,
      })),
      skipDuplicates: true,
    });
  } else if (projectsToUpdate.remove.length > 0) {
    await db.projectTag.deleteMany({
      where: {
        projectId: {
          in: projectsToUpdate.remove,
        },
        tagId: tag.id,
      },
    });
  }

  return {
    added: projectsToUpdate.add.length,
    removed: projectsToUpdate.remove.length,
    totalProjects: projects.length,
  };
};
