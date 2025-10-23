import { CREATED, OK } from "../constants/http";
import {
  CreateFolderSchema,
  DeleteFolderOrFileSchema,
  RenameFolderOrFileSchema,
} from "../schemas/folder.schema";
import {
  createFolder,
  DeleteFolderOrFile,
  renameFolderOrFile,
} from "../services/folder.services";
import catchErrors from "../utils/catchErrors";

export const createFolderHandler = catchErrors(async (req, res) => {
  // Validate the request body
  const validationResult = CreateFolderSchema.parse(req.body);

  const { folderCreated } = await createFolder(validationResult);

  return res.status(CREATED).json({
    status: "success",
    message: "Folder created successfully",
    data: folderCreated,
  });
});

export const renameFolderOrFileHandler = catchErrors(async (req, res) => {
  const { id: itemId } = req.params;
  const userId = req.userId;

  const validationResult = RenameFolderOrFileSchema.parse(req.body);

  const { renamedItem } = await renameFolderOrFile({
    itemId,
    userId,
    ...validationResult,
  });

  return res.status(OK).json({
    status: "success",
    message: `${
      validationResult.type === "folder" ? "Folder" : "File"
    } renamed successfully`,
    data: renamedItem,
  });
});

export const deleteFolderOrFileHandler = catchErrors(async (req, res) => {
  const { id: itemId } = req.params;
  const userId = req.userId;

  const validationResult = DeleteFolderOrFileSchema.parse(req.body);

  const { deletedItem } = await DeleteFolderOrFile({
    itemId,
    userId,
    ...validationResult,
  });

  return res.status(OK).json({
    status: "success",
    message: `${
      validationResult.type === "folder" ? "Folder" : "File"
    } moved to trash successfully`,
    data: deletedItem,
  });
});
