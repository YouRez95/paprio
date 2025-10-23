import { getAuth } from "@clerk/express";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import { NOT_FOUND } from "../constants/http";
import prisma from "../config/db";
import { ENV } from "../constants/env";

export const fetchUserMiddleware = catchErrors(async (req, res, next) => {
  let clerkId;

  if (ENV === "development") {
    clerkId = "user_33TBEQWGxpfSvjLt5a9NNrhHJHW";
  } else {
    const { userId } = getAuth(req);
    clerkId = userId;
    appAssert(clerkId, NOT_FOUND, "Error: User not found");
  }

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
