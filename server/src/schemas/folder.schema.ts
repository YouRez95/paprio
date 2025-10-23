import z from "zod";

export const CreateFolderSchema = z.object({
  folderName: z.string(),
  projectId: z.string(),
  parentFolderId: z.string().nullable().optional(),
});

export type CreateFolderSchemaType = z.infer<typeof CreateFolderSchema>;

export const RenameFolderOrFileSchema = z.object({
  newName: z.string(),
  type: z.enum(["file", "folder"]),
});
export type RenameFolderOrFileSchemaType = z.infer<
  typeof RenameFolderOrFileSchema
>;

export const DeleteFolderOrFileSchema = z.object({
  name: z.string(),
  type: z.enum(["file", "folder"]),
});
export type DeleteFolderOrFileSchemaType = z.infer<
  typeof DeleteFolderOrFileSchema
>;
