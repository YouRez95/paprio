import { Router } from "express";
import bodyParser from "body-parser";
import { authControllerWebhook } from "../controllers/auth.controllers";

const authRoutes = Router();

// prefix:  /api/v1/auth

authRoutes.post(
  "/webhooks/clerk",
  bodyParser.raw({ type: "application/json" }),
  authControllerWebhook
);

export default authRoutes;
