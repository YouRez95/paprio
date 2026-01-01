import "dotenv/config";
import express from "express";
import cors from "cors";
import { APP_ORIGIN, ENV, PORT } from "./constants/env";
import authRoutes from "./routes/auth.routes";
import tagRoutes from "./routes/tag.routes";
import {
  fetchUserMiddleware,
  fetchUserMiddlewareForPdf,
} from "./middleware/fetchUserMiddelware";
import { clerkMiddleware } from "@clerk/express";
import projectRoutes from "./routes/project.routes";
import errorHandler from "./middleware/errorHandler";
import folderRoutes from "./routes/folder.routes";
import documentRoutes from "./routes/document.routes";
import blockRoutes from "./routes/block.routes";
import pdfRoutes from "./routes/pdfs.route";
import path from "path";

const app = express();

// Middleware
app.use(cors({ origin: APP_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(clerkMiddleware());
app.use("/api/v1/pdfs", express.static(path.join(__dirname, "../public/pdfs")));

// Health Check Endpoint
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Auth routes
app.use("/api/v1/auth", authRoutes);

// Tag routes
// app.use("/api/v1/tags", requireAuth(), fetchUserMiddleware, tagRoutes);
app.use("/api/v1/tags", fetchUserMiddleware, tagRoutes);

// Project Routes
app.use("/api/v1/projects", fetchUserMiddleware, projectRoutes);

// Folder Routes
app.use("/api/v1/folders", fetchUserMiddleware, folderRoutes);

// Documents Routes
app.use("/api/v1/documents", fetchUserMiddleware, documentRoutes);

// PDF Routes
app.use("/api/v1/pdfs", pdfRoutes);

// Blocks Routes
app.use("/api/v1/blocks", fetchUserMiddleware, blockRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running in ${PORT} in ${ENV} environment`);
});
