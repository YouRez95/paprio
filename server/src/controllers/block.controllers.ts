import { getBlocksByTypeSchema } from "../schemas/block.schema";
import { getBlockById, getBlocksByType } from "../services/block.services";
import catchErrors from "../utils/catchErrors";
import { OK } from "../constants/http";

export const getBlocksByTypeHandler = catchErrors(async (req, res) => {
  const { type } = getBlocksByTypeSchema.parse(req.params);
  const search = req.query.search as string | undefined;
  console.log("Fetching blocks of type:", type, "with search:", search);
  // Service to get blocks by type from database
  const { blocks } = await getBlocksByType(type, search);
  res.status(OK).json({
    status: "success",
    message: "Blocks fetched successfully",
    data: blocks,
  });
});

export const getBlockByIdHandler = catchErrors(async (req, res) => {
  const { blockId } = req.params;

  // Call the service
  const { block } = await getBlockById(blockId);
  res.status(OK).json({
    status: "success",
    message: "Block fetched successfully",
    data: block,
  });
});
