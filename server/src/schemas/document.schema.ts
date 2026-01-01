import z from "zod";

export const CreateDocumentSchema = z.object({
  title: z.string(),
  projectId: z.string(),
  folderId: z.string().nullable().optional(),
});

export const createDocumentVersionSchema = z.object({
  note: z.string().max(120).optional(),
});

export type CreateDocumentSchemaType = z.infer<typeof CreateDocumentSchema>;

export const UpdateDocumentNameSchema = z.object({
  newName: z.string(),
});

export type UpdateDocumentNameSchemaType = z.infer<
  typeof UpdateDocumentNameSchema
>;

const LatexPageConfigSchema = z.object({
  documentClass: z.object({
    type: z.enum(["article", "report", "book"]),
    fontSize: z.enum(["10pt", "11pt", "12pt"]),
    paperSize: z.enum(["a4paper", "a5paper", "letter"]),
    twoSide: z.boolean(),
  }),
  orientation: z.enum(["portrait", "landscape"]),
  margins: z.object({
    top: z.number(),
    bottom: z.number(),
    left: z.number(),
    right: z.number(),
  }),
  lineSpacing: z.enum(["single", "oneHalf", "double"]),
});

export type LatexPageConfigSchemaType = z.infer<typeof LatexPageConfigSchema>;

export const CompileDocumentSchema = z.object({
  added: z
    .array(
      z.object({
        id: z.string(),
        blockDefId: z.string(),
        config: z.record(z.any(), z.any()),
        order: z.number().int().positive(),
        name: z.string(),
      })
    )
    .default([]),

  updated: z
    .array(
      z.object({
        id: z.string(),
        blockDefId: z.string(),
        config: z.record(z.any(), z.any()),
        order: z.number().int().positive(),
        name: z.string(),
      })
    )
    .default([]),

  removed: z.array(z.string()).default([]),

  orderUpdates: z
    .array(
      z.object({
        id: z.string(),
        order: z.number().int().positive(),
      })
    )
    .optional(),

  latexPageConfig: LatexPageConfigSchema.optional(),
  savePdf: z.boolean().optional(),
});

export type CompileDocumentSchemaType = z.infer<typeof CompileDocumentSchema>;
