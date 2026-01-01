import { BlockType } from "@prisma/client";
import z from "zod";

export const blockEnum = z.enum(Object.values(BlockType));

export const getBlocksByTypeSchema = z.object({
  type: blockEnum,
});
