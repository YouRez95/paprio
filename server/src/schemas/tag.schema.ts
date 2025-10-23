import z from "zod";

export const CreateTagSchema = z.object({
  tagName: z
    .string()
    .min(2, { message: "Tag name must be at least 2 characters" })
    .max(50, { message: "You reached the max characters limit" }),
  color: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
    message: "Invalid hex color",
  }),
  projectIds: z.array(z.string()).optional(),
});

export type CreateTagSchemaType = z.infer<typeof CreateTagSchema>;

export const ToggleTagSchema = z.object({
  tagId: z.string().uuid(),
  projectIds: z.array(z.string()),
  type: z.enum(["add", "remove"]),
});

export type ToggleTagSchemaType = z.infer<typeof ToggleTagSchema>;
