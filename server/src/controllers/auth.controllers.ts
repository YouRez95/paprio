import { Webhook } from "svix";
import { BAD_REQUEST, CREATED, OK, UNAUTHORIZED } from "../constants/http";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import { WebhookEvent } from "@clerk/express";
import { CLERK_WEBHOOK_SECRET_KEY } from "../constants/env";
import createUserToDatabase from "../services/auth.services";
import type { Request, Response } from "express";

// Type for Clerk user data payload
type ClerkUserData = {
  id: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  email_addresses: { email_address: string }[];
};

export const authControllerWebhook = catchErrors(
  async (req: Request, res: Response) => {
    // Validate webhook signature first
    const wh = new Webhook(CLERK_WEBHOOK_SECRET_KEY);
    const headers = req.headers;
    const payload = req.body;

    // Get Svix headers for verification
    const svixId = headers["svix-id"];
    const svixTimestamp = headers["svix-timestamp"];
    const svixSignature = headers["svix-signature"];

    appAssert(
      svixId && svixTimestamp && svixSignature,
      BAD_REQUEST,
      "Missing required Svix headers"
    );

    let evt: WebhookEvent;
    try {
      evt = wh.verify(JSON.stringify(payload), {
        "svix-id": svixId as string,
        "svix-timestamp": svixTimestamp as string,
        "svix-signature": svixSignature as string,
      }) as WebhookEvent;
    } catch (err) {
      throw appAssert(false, UNAUTHORIZED, "Invalid webhook signature");
    }

    appAssert(evt.data, BAD_REQUEST, "Missing webhook payload data");

    // Type-safe parsing of user data
    const { id, first_name, last_name, email_addresses, profile_image_url } =
      evt.data as ClerkUserData;

    // Handle specific event types
    switch (evt.type) {
      case "user.created": {
        const firstName = first_name ?? "unknown";
        const lastName = last_name ?? "unknown";
        const email = email_addresses[0]?.email_address;
        const image = profile_image_url ?? null;

        appAssert(email, BAD_REQUEST, "Email address is required");

        await createUserToDatabase({ id, firstName, lastName, email, image });
        return res.status(CREATED).json({
          success: true,
          message: "User created successfully",
        });
      }

      // Add other event types as needed
      // case "user.updated":
      // case "user.deleted":

      default:
        return res.status(OK).json({
          success: true,
          message: "Webhook received but no action taken",
        });
    }
  }
);
