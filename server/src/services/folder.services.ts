import db from "../config/db";
import { NOT_FOUND } from "../constants/http";
import {
  CreateFolderSchemaType,
  DeleteFolderOrFileSchemaType,
  RenameFolderOrFileSchemaType,
} from "../schemas/folder.schema";
import appAssert from "../utils/appAssert";

import { Document, Folder } from "@prisma/client";

export const createFolder = async (folderData: CreateFolderSchemaType) => {
  const { folderName, projectId, parentFolderId } = folderData;

  // Check if the project exist
  const projectExist = await db.project.findFirst({
    where: {
      id: projectId,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  appAssert(projectExist, NOT_FOUND, "Project does not exist");

  // Check if the folder name already exist
  const folderExist = await db.folder.findFirst({
    where: {
      name: folderName,
      projectId: projectExist.id,
      parentFolderId: parentFolderId || null,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  appAssert(
    !folderExist,
    NOT_FOUND,
    "Folder with this name already exists in this path"
  );

  // Create the folder
  const folder = await db.folder.create({
    data: {
      name: folderName,
      projectId: projectId,
      parentFolderId: parentFolderId || null,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      projectId: true,
      parentFolderId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return { folderCreated: folder };
};

export const renameFolderOrFile = async ({
  itemId,
  newName,
  userId,
  type,
}: RenameFolderOrFileSchemaType & { itemId: string; userId: string }) => {
  let renamedItem: null | Document | Folder = null;

  if (type === "file") {
    await db.$transaction(async (tx) => {
      const fileExist = await tx.document.findFirst({
        where: {
          deletedAt: null,
          id: itemId,
          project: {
            OR: [{ ownerId: userId }, { members: { some: { userId } } }],
          },
        },
        select: {
          title: true,
          folderId: true,
          projectId: true,
        },
      });

      appAssert(fileExist, NOT_FOUND, "File does not exist or access denied");

      const fileWithSameName = await tx.document.findFirst({
        where: {
          title: newName,
          folderId: fileExist.folderId,
          projectId: fileExist.projectId,
          deletedAt: null,
        },
      });

      appAssert(
        !fileWithSameName,
        NOT_FOUND,
        "A file with this name already exists in this folder"
      );

      renamedItem = await tx.document.update({
        where: {
          id: itemId,
        },
        data: {
          title: newName,
        },
      });
    });
  } else if (type === "folder") {
    await db.$transaction(async (tx) => {
      const folderExist = await tx.folder.findFirst({
        where: {
          deletedAt: null,
          id: itemId,
          project: {
            OR: [{ ownerId: userId }, { members: { some: { userId } } }],
          },
        },
        select: {
          name: true,
          parentFolderId: true,
          projectId: true,
        },
      });

      appAssert(
        folderExist,
        NOT_FOUND,
        "Folder does not exist or access denied"
      );

      const folderWithSameName = await tx.folder.findFirst({
        where: {
          name: newName,
          parentFolderId: folderExist.parentFolderId,
          projectId: folderExist.projectId,
          deletedAt: null,
        },
      });

      appAssert(
        !folderWithSameName,
        NOT_FOUND,
        "A folder with this name already exists in this path"
      );

      renamedItem = await tx.folder.update({
        where: {
          id: itemId,
        },
        data: {
          name: newName,
        },
      });
    });
  }

  appAssert(
    renamedItem !== null,
    NOT_FOUND,
    "Item not found or could not be renamed"
  );

  return { renamedItem } as { renamedItem: Document | Folder };
};

export const DeleteFolderOrFile = async ({
  itemId,
  name,
  type,
  userId,
}: DeleteFolderOrFileSchemaType & { itemId: string; userId: string }) => {
  let deletedItem: null | Document | Folder = null;

  const deletedAt = new Date();

  if (type === "file") {
    deletedItem = await db.document.update({
      where: {
        id: itemId,
        deletedAt: null,
        project: {
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
      },
      data: {
        deletedAt,
      },
    });
  } else if (type === "folder") {
    deletedItem = await db.folder.update({
      where: {
        id: itemId,
        deletedAt: null,
        project: {
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
      },
      data: {
        deletedAt,
      },
    });
  }

  appAssert(
    deletedItem !== null,
    NOT_FOUND,
    "Item not found or could not be deleted"
  );

  return { deletedItem } as { deletedItem: Document | Folder };
};
