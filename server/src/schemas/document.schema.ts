import z from "zod";

export const CreateDocumentSchema = z.object({
  title: z.string(),
  projectId: z.string(),
  folderId: z.string().nullable().optional(),
});

export type CreateDocumentSchemaType = z.infer<typeof CreateDocumentSchema>;
