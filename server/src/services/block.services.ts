import { BlockType } from "@prisma/client";
import db from "../config/db";

export const getBlocksByType = async (type: BlockType, search?: string) => {
  // WIP: get blocks depend on the plan of the user
  // WIP: Add DB indexes on name, type, active
  // WIP: Consider full-text search later
  // WIP: Cache popular searches in Redis
  const cleanSearch = search?.trim();
  const blocks = await db.blockDefinition.findMany({
    where: {
      active: true,

      // Type filter
      ...(type !== "ALL" && { type }),

      // Search filter
      ...(cleanSearch && {
        OR: [
          { name: { contains: cleanSearch } },
          { description: { contains: cleanSearch } },
        ],
      }),
    },

    orderBy: {
      usageCount: "desc",
    },

    select: {
      id: true,
      name: true,
      description: true,
      thumbnailUrl: true,
      defaultConfig: true,
    },
  });

  return { blocks };
};

export const getBlockById = async (blockId: string) => {
  // WIP: Depend on the plan

  const block = await db.blockDefinition.findUnique({
    where: {
      id: blockId,
    },
    select: {
      id: true,
      configSchema: true,
      description: true,
    },
  });

  return { block };
};
