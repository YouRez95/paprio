import { CREATED, OK } from "../constants/http";
import { CreateTagSchema, ToggleTagSchema } from "../schemas/tag.schema";
import { createTag, getAllTags, toggleTag } from "../services/tag.services";
import catchErrors from "../utils/catchErrors";

export const getAllTagsHandler = catchErrors(async (req, res) => {
  const userId = req.userId;
  const { tags } = await getAllTags(userId);

  return res.status(OK).json({
    status: "success",
    message: "Tags retrieved successfully",
    data: tags,
  });
});

export const createTagsHandler = catchErrors(async (req, res) => {
  // Validate the request body
  const validationResult = CreateTagSchema.parse(req.body);
  const userId = req.userId;

  const { tag } = await createTag(userId, validationResult);

  return res.status(CREATED).json({
    status: "success",
    message: "Tag created successfully",
    data: tag,
  });
});

export const toggleTagHandler = catchErrors(async (req, res) => {
  // Validate the body
  const validationResult = ToggleTagSchema.parse(req.body);
  const userId = req.userId;

  // Call the service to toggle the tag
  const { totalProjects } = await toggleTag(validationResult, userId);

  return res.status(OK).json({
    status: "success",
    message: `Tag ${
      validationResult.type === "add" ? "added" : "removed"
    } successfully`,
    data: {
      totalProjects: totalProjects,
    },
  });
});
