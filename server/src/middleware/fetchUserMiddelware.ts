import { getAuth } from "@clerk/express";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import { FORBIDDEN, NOT_FOUND } from "../constants/http";
import prisma from "../config/db";
import { ENV } from "../constants/env";
import crypto from "crypto";

export const fetchUserMiddleware = catchErrors(async (req, res, next) => {
  let clerkId;
  const userAgent = req.get("User-Agent") || "";

  // if (userAgent.includes("PostmanRuntime") && ENV === "development") {
  //   clerkId = "user_33TBEQWGxpfSvjLt5a9NNrhHJHW";
  // } else {
  const { userId } = getAuth(req);
  clerkId = userId;
  appAssert(clerkId, NOT_FOUND, "Error: User not found");
  // }

  let user;
  // Find the user
  user = await prisma.user.findUnique({
    where: {
      clerkId,
    },
  });

  // WIP: If user is not found mean the hook failed, we need to handle this case
  appAssert(user, NOT_FOUND, "Error: User not found");

  req.userId = user.id;
  // Add another property to the request object if nedeed (like role)
  next();
});

export const fetchUserMiddlewareForPdf = catchErrors(async (req, res, next) => {
  const { token, userId } = req.query;
  const { documentId } = req.params;

  appAssert(token, FORBIDDEN, "Missing access token");
  appAssert(userId, FORBIDDEN, "Missing userId");

  // STEP 1: Recompute expected token
  const expected = crypto
    .createHmac("sha256", process.env.PDF_SECRET!)
    .update(`${documentId}:${userId}`)
    .digest("hex");

  // STEP 2: Compare tokens securely
  const isValid = crypto.timingSafeEqual(
    Buffer.from(token as string),
    Buffer.from(expected)
  );

  appAssert(isValid, FORBIDDEN, "Invalid or expired access token");

  // STEP 3: userId is safe → attach to request
  req.userId = userId as string;

  next();
});
