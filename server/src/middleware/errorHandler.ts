import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ErrorRequestHandler, Response } from "express";
import AppError from "../utils/appError";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";

const handlePrismaError = (err: PrismaClientKnownRequestError, res: any) => {
  const errorCode = err.code;
  const modelName = err.meta?.modelName || "Projecttttt";
  if (err.code === "P2002") {
    return res.status(BAD_REQUEST).json({
      status: "failed",
      message: `A ${modelName} with this name already exists`,
    });
  }
};

const handleAppError = (res: Response, err: AppError) => {
  return res.status(err.statusCode).json({
    status: "failed",
    message: err.message,
  });
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(`PATH : ${req.path}`, err);

  if (err instanceof PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  }

  if (err instanceof AppError) {
    handleAppError(res, err);
    return;
  }

  res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
};

export default errorHandler;
