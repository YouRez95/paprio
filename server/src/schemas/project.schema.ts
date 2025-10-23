import z from "zod";

export const CreateProjectSchema = z.object({
  projectName: z
    .string()
    .min(3, { message: "Project name must be at least 3 characters" })
    .max(50, { message: "You reached the max characters limit" }),
  projectDescription: z.string().max(500).optional(),
});

export type CreateProjectSchemaType = z.infer<typeof CreateProjectSchema>;

export const GetAllProjectsSchema = z.object({
  search: z
    .string()
    .optional()
    .transform((val) => (val ? val.trim() : "")),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)),
  tag: z.string().optional(),
});

export type GetAllProjectsSchemaType = z.infer<typeof GetAllProjectsSchema>;
