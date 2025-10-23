import db from "../config/db";
import { NOT_FOUND } from "../constants/http";
import { CreateDocumentSchemaType } from "../schemas/document.schema";
import appAssert from "../utils/appAssert";

export const createDocument = async (input: CreateDocumentSchemaType) => {
  const { projectId, title, folderId } = input;

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

  // If folderId is provided, check if the folder exist
  if (folderId) {
    const folderExist = await db.folder.findFirst({
      where: {
        id: folderId,
        projectId: projectExist.id,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });
    appAssert(folderExist, NOT_FOUND, "Folder does not exist");
  }

  // Create the document
  const document = await db.document.create({
    data: {
      title,
      folderId: folderId || null,
      projectId: projectExist.id,
    },
    select: {
      id: true,
      title: true,
      folderId: true,
      projectId: true,
    },
  });

  return { documentCreated: document };
};
