import { ProjectRole } from "@prisma/client";
import db from "../config/db";
import fs from "fs";
import { BAD_REQUEST, CONFLICT, FORBIDDEN, NOT_FOUND } from "../constants/http";
import {
  CompileDocumentSchemaType,
  CreateDocumentSchemaType,
  LatexPageConfigSchemaType,
  UpdateDocumentNameSchemaType,
} from "../schemas/document.schema";
import appAssert from "../utils/appAssert";
import {
  compileBlockLatex,
  extractColorsFromConfig,
  generateEmptyDocumentLatex,
  generateLatexDocument,
  generatePackages,
  generatePageConfig,
} from "../utils/latexUtils/helpers";
import { compileLatexToPdf } from "../utils/latexUtils/compileLatexToPDF";
import { generateSignedPdfUrl, uploadPdfToR2 } from "../config/r2";
import crypto from "crypto";
import { DEFAULT_PDF_URL, PDF_SECRET } from "../constants/env";
import { sha256 } from "../utils/createHash";
import { convertEditorFieldsInConfig } from "../utils/latexUtils/editorToLatex";
// import { sha256 } from "crypto";

export const createDocument = async (
  input: CreateDocumentSchemaType & { userId: string }
) => {
  const { projectId, title, folderId, userId } = input;

  // Check if the project exist
  const projectExist = await db.project.findFirst({
    where: {
      id: projectId,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });
  appAssert(projectExist, NOT_FOUND, "Project does not exist");

  // Check if the user has the permission to create document in the project
  const member = await db.projectMember.findFirst({
    where: {
      projectId: projectExist.id,
      userId,
    },
    select: {
      role: true,
    },
  });

  const hasAccess =
    member?.role === ProjectRole.EDITOR || member?.role === ProjectRole.ADMIN;
  appAssert(
    hasAccess,
    FORBIDDEN,
    "You do not have permission to create document in this project"
  );

  // If folderId is provided, check if the folder exist
  if (folderId) {
    const folderExist = await db.folder.findFirst({
      where: {
        id: folderId,
        projectId: projectExist.id,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });
    appAssert(folderExist, NOT_FOUND, "Folder does not exist");
  }

  //CHECK: Verify no duplicate name in the same location
  const duplicateDocument = await db.document.findFirst({
    where: {
      projectId: projectExist.id,
      folderId: folderId || null,
      title,
      deletedAt: null,
    },
  });

  appAssert(
    !duplicateDocument,
    CONFLICT,
    "A document with this name already exists in this location"
  );

  // Create the document
  const document = await db.document.create({
    data: {
      title,
      folderId: folderId || null,
      projectId: projectExist.id,
    },
    select: {
      id: true,
      title: true,
      folderId: true,
      projectId: true,
    },
  });

  return { documentCreated: document };
};

export const updateDocumentName = async ({
  newName,
  documentId,
  userId,
}: UpdateDocumentNameSchemaType & { documentId: string; userId: string }) => {
  // Check if the document exists
  const documentExist = await db.document.findFirst({
    where: {
      id: documentId,
    },
    select: {
      id: true,
      projectId: true,
      folderId: true,
    },
  });
  appAssert(documentExist, NOT_FOUND, "Document does not exist");

  // Check if the user has permission to update the document
  const member = await db.projectMember.findFirst({
    where: {
      projectId: documentExist.projectId,
      userId,
    },
    select: {
      role: true,
    },
  });
  const hasAccess =
    member?.role === ProjectRole.EDITOR || member?.role === ProjectRole.ADMIN;
  appAssert(
    hasAccess,
    FORBIDDEN,
    "You do not have permission to update the document"
  );

  // ✅ CHECK: Verify no duplicate name in the same location
  const duplicateDocument = await db.document.findFirst({
    where: {
      projectId: documentExist.projectId,
      folderId: documentExist.folderId,
      title: newName,
      deletedAt: null,
      id: { not: documentId },
    },
  });
  appAssert(
    !duplicateDocument,
    CONFLICT,
    "A document with this name already exists in this location"
  );

  // Update the document name
  const document = await db.document.update({
    where: {
      id: documentId,
    },
    data: {
      title: newName,
    },
    select: {
      id: true,
      title: true,
      folderId: true,
      projectId: true,
    },
  });

  return { documentUpdated: document };
};

export const getDocumentById = async (documentId: string, userId: string) => {
  // Find the document with minimal data
  const document = await db.document.findFirst({
    where: { id: documentId, deletedAt: null },
    include: {
      project: { select: { id: true, ownerId: true } },
    },
  });

  appAssert(document, NOT_FOUND, "Document not found");

  // Validate access
  const isOwner = document.project.ownerId === userId;

  const member = await db.projectMember.findFirst({
    where: { projectId: document.projectId, userId },
  });

  const hasAccess = isOwner || !!member;
  appAssert(hasAccess, FORBIDDEN, "You do not have access to this document");

  const role = isOwner ? ProjectRole.ADMIN : member!.role;
  const canEdit = role === "EDITOR" || role === "ADMIN";

  // -------------------------------
  // Generate signed PDF URL (ONLY IF PDF EXISTS)
  // -------------------------------
  let pdfUrl: string | null = null;

  if (document.pdfR2Key) {
    const token = crypto
      .createHmac("sha256", PDF_SECRET)
      .update(`${documentId}:${userId}`)
      .digest("hex");

    pdfUrl = `/pdfs/read/${documentId}?userId=${userId}&token=${token}`;
  } else {
    pdfUrl = DEFAULT_PDF_URL;
  }

  // VIEWER: return limited data (no blocks)
  if (!canEdit) {
    return {
      document: {
        id: document.id,
        title: document.title,
        pdfUrl,
        role,
        hasPermissionToEdit: false,
        blocks: [], // viewer cannot see blocks
      },
    };
  }

  // EDITOR / ADMIN: return full document
  const fullDocument = await db.document.findUnique({
    where: { id: documentId },
    include: {
      project: { select: { id: true, name: true } },
      folder: { select: { id: true, name: true } },
      blocks: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          blockDefId: true,
          createdAt: true,
          config: true,
          name: true,
          order: true,
          blockDefinition: {
            select: {
              description: true,
              thumbnailUrl: true,
              name: true,
              defaultConfig: true,
            },
          },
        },
      },
    },
  });

  appAssert(fullDocument, NOT_FOUND, "Document not found");

  return {
    document: {
      id: fullDocument.id,
      title: fullDocument.title,
      pdfUrl,
      blocks: fullDocument.blocks,
      latexConfig: fullDocument.latexConfig,
      role,
      hasPermissionToEdit: true,
    },
  };
};

// Updated compile function
type CompileDocumentParams = {
  documentId: string;
  userId: string;
  blocks: CompileDocumentSchemaType;
};

export const compileDocument = async ({
  blocks,
  documentId,
  userId,
}: CompileDocumentParams) => {
  // console.info("blocks content", blocks.updated[0].config.content);
  // STEP 1: Validation
  const document = await db.document.findUnique({
    where: { id: documentId, deletedAt: null },
  });
  appAssert(document, NOT_FOUND, "Document not found");

  const member = await db.projectMember.findFirst({
    where: { projectId: document.projectId, userId },
    select: { role: true },
  });
  const hasAccess =
    member?.role === ProjectRole.EDITOR || member?.role === ProjectRole.ADMIN;
  appAssert(hasAccess, FORBIDDEN, "You do not have access to this document");

  // STEP 2: Update LaTeX Config if provided
  if (blocks.latexPageConfig) {
    await db.document.update({
      where: { id: documentId },
      data: {
        latexConfig: blocks.latexPageConfig as any, // Prisma JSON field
      },
    });
  }

  // STEP 3: Handle Removed Blocks
  if (blocks.removed.length > 0) {
    await db.$transaction(async (tx) => {
      //a. Delete removed blocks
      await tx.documentBlock.deleteMany({
        where: {
          id: { in: blocks.removed },
          documentId,
        },
      });

      //b. Fetch remaining blocks
      const remainingBlocks = await tx.documentBlock.findMany({
        where: { documentId },
        orderBy: { order: "asc" },
        select: { id: true },
      });

      //c. Reassign order
      // console.log("Remaining blocks:", remainingBlocks);
      const updates = remainingBlocks.map((block, index) =>
        tx.documentBlock.update({
          where: { id: block.id },
          data: { order: index + 1 },
        })
      );

      //d. Execute updates
      await Promise.all(updates);
    });
  }

  // Track color definitions
  const colorDefinitions = new Map<string, string>();

  // STEP 4: Process Added & Updated Blocks
  const changedBlocks = [...blocks.added, ...blocks.updated];

  if (changedBlocks.length > 0) {
    const uniqueBlockDefIds = [
      ...new Set(changedBlocks.map((block) => block.blockDefId)),
    ];

    // console.log("uniqueBlockDefIds", uniqueBlockDefIds);

    const blockDefinitions = await db.blockDefinition.findMany({
      where: { id: { in: uniqueBlockDefIds } },
      select: {
        id: true,
        latexTemplate: true,
        variableRules: true,
        configSchema: true,
        requiredPackages: true,
      },
    });

    const definitionsMap = new Map(
      blockDefinitions.map((def) => [def.id, def])
    );

    // console.log("definitionsMap", definitionsMap);

    // Compile each changed block
    await Promise.all(
      changedBlocks.map(async (block) => {
        const definition = definitionsMap.get(block.blockDefId);

        if (!definition) {
          throw new Error(`Block definition ${block.blockDefId} not found`);
        }

        // Extract colors from config and build processedConfig
        const processedConfig: Record<string, any> =
          block.config &&
          typeof block.config === "object" &&
          !Array.isArray(block.config)
            ? { ...(block.config as Record<string, any>) }
            : {};

        const configWithLatex = convertEditorFieldsInConfig(
          processedConfig,
          definition.configSchema
        );
        // console.log(
        //   "config with latex from convertEditorFieldsInConfig",
        //   configWithLatex
        // );
        extractColorsFromConfig(configWithLatex, colorDefinitions);

        // Replace hex values with color names
        Object.entries(configWithLatex).forEach(([key, value]) => {
          if (typeof value === "string" && value.match(/^#[0-9A-Fa-f]{6}$/)) {
            configWithLatex[key] = colorDefinitions.get(value)!;
          }
        });

        // Compile the LaTeX
        const latexSource = compileBlockLatex(definition, configWithLatex);
        // console.log(
        //   "latex Source from function compileBlockLatex",
        //   latexSource
        // );

        // console.log("Compiled LaTeX for block", block.id, ":", latexSource);
        await db.documentBlock.upsert({
          where: { id: block.id },
          create: {
            id: block.id,
            documentId,
            blockDefId: block.blockDefId,
            order: block.order,
            name: block.name || `Block ${block.order}`,
            config: block.config,
            latexSource,
            packages: definition.requiredPackages || [],
          },
          update: {
            config: block.config,
            latexSource,
            packages: definition.requiredPackages || [],
            order: block.order,
            name: block.name,
            updatedAt: new Date(),
          },
        });
      })
    );
  }

  // STEP 5: Fetch All Blocks
  const allBlocks = await db.documentBlock.findMany({
    where: { documentId },
    orderBy: { order: "asc" },
    select: {
      id: true,
      latexSource: true,
      packages: true,
      order: true,
      config: true,
    },
  });

  // console.log("All blocks fetched:", allBlocks.length);
  let fullLatex: string;
  if (allBlocks.length === 0) {
    fullLatex = generateEmptyDocumentLatex();
  } else {
    // STEP 6: Extract colors from ALL blocks (including unchanged ones)
    allBlocks.forEach((block) => {
      const cfg =
        block.config &&
        typeof block.config === "object" &&
        !Array.isArray(block.config)
          ? (block.config as Record<string, any>)
          : {};
      extractColorsFromConfig(cfg, colorDefinitions);
    });

    // STEP 7: Generate Packages Section
    const packages = generatePackages(allBlocks, colorDefinitions);

    // STEP 8: Assemble Full LaTeX Document
    const content = allBlocks.map((block) => block.latexSource).join("\n\n");
    const latexConfig = blocks.latexPageConfig || document.latexConfig;
    const pageConfig = generatePageConfig(
      latexConfig as LatexPageConfigSchemaType
    );
    fullLatex = generateLatexDocument(content, pageConfig, packages);
  }

  // console.log("fullLatex before compile", fullLatex);
  // STEP 9: Compile to PDF
  const pdfBuffer = await compileLatexToPdf(fullLatex);

  // STEP 10: Save PDF to R2 Storage
  // TODO: Add That work to a background job queue like BullMQ
  const { r2Key } = await uploadPdfToR2(
    pdfBuffer,
    document.projectId,
    documentId
  );

  // STEP 11: Update Document Status and pdfR2Key
  await db.document.update({
    where: { id: documentId },
    data: {
      latexSource: fullLatex,
      lastCompiledAt: new Date(),
      compilationStatus: "SUCCESS",
      compilationError: null,
      pdfR2Key: r2Key,
    },
  });

  // STEP 12: Handle PDF Response
  const pdfSizeMB = pdfBuffer.length / (1024 * 1024);

  if (pdfSizeMB < 5) {
    return {
      success: true,
      pdfBuffer: pdfBuffer.toString("base64"),
      size: pdfBuffer.length,
    };
  } else {
    const tempToken = crypto.randomUUID();
    const tempPath = `/tmp/pdf-${documentId}-${tempToken}.pdf`;

    await fs.promises.writeFile(tempPath, pdfBuffer);

    setTimeout(() => {
      fs.promises.unlink(tempPath).catch(console.error);
    }, 5 * 60 * 1000);

    return {
      success: true,
      pdfUrl: `/api/temp-pdf/${tempToken}`,
      expiresIn: 300,
      size: pdfBuffer.length,
    };
  }
};

type CreateDocumentVersionParams = {
  documentId: string;
  userId: string;
  note?: string;
};

export const createDocumentVersion = async ({
  documentId,
  userId,
  note,
}: CreateDocumentVersionParams) => {
  // STEP 1: Load document
  const document = await db.document.findUnique({
    where: { id: documentId, deletedAt: null },
    include: { blocks: true },
  });
  appAssert(document, NOT_FOUND, "Document not found");

  // STEP 2: Permissions
  const member = await db.projectMember.findFirst({
    where: { projectId: document.projectId, userId },
    select: { role: true },
  });

  const canEdit =
    member?.role === ProjectRole.EDITOR || member?.role === ProjectRole.ADMIN;

  appAssert(canEdit, FORBIDDEN, "You do not have access to this document");

  // STEP 3: New document guard
  appAssert(
    document.blocks.length > 0 && document.latexSource,
    BAD_REQUEST,
    "Document is empty. Add content before creating a version."
  );

  // STEP 4: Version limit
  const versionCount = await db.documentVersion.count({
    where: { documentId },
  });
  appAssert(versionCount < 5, BAD_REQUEST, "Maximum version limit reached.");

  // STEP 5: Hash comparison
  const currentHash = sha256(document.latexSource);

  const latestVersion = await db.documentVersion.findFirst({
    where: { documentId },
    orderBy: { version: "desc" },
  });

  if (latestVersion) {
    appAssert(
      latestVersion.hash !== currentHash,
      CONFLICT,
      "No changes detected since last version."
    );
  }

  // STEP 6: Compile
  const pdfBuffer = await compileLatexToPdf(document.latexSource);
  const nextVersion = latestVersion ? latestVersion.version + 1 : 1;

  // STEP 7: Upload + DB transaction
  return await db.$transaction(async (tx) => {
    // Upload version PDF
    const { r2Key: versionR2Key } = await uploadPdfToR2(
      pdfBuffer,
      document.projectId,
      documentId,
      nextVersion
    );

    // Update current document PDF (IMPORTANT)
    await tx.document.update({
      where: { id: documentId },
      data: {
        pdfR2Key: versionR2Key,
        latestVersion: nextVersion,
        lastCompiledAt: new Date(),
      },
    });

    // Create immutable version
    return tx.documentVersion.create({
      data: {
        documentId,
        version: nextVersion,
        hash: currentHash,
        pdfR2Key: versionR2Key,
        createdBy: userId,
        title: document.title,
        latexConfig: document.latexConfig || {},
        latexSource: document.latexSource!,
        note: note,
      },
    });
  });
};

export const getDocumentVersions = async ({
  documentId,
  userId,
}: CreateDocumentVersionParams) => {
  // STEP 1: Load document
  const document = await db.document.findUnique({
    where: { id: documentId, deletedAt: null },
    include: { blocks: true },
  });
  appAssert(document, NOT_FOUND, "Document not found");

  // STEP 2: Permissions
  const member = await db.projectMember.findFirst({
    where: { projectId: document.projectId, userId },
    select: { role: true },
  });

  const canEdit =
    member?.role === ProjectRole.EDITOR || member?.role === ProjectRole.ADMIN;

  appAssert(canEdit, FORBIDDEN, "You do not have access to this document");

  // STEP 3: Fetch versions
  const versions = await db.documentVersion.findMany({
    where: { documentId },
    orderBy: { version: "desc" },
    select: {
      id: true,
      documentId: true,
      title: true,
      version: true,
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      createdAt: true,
      note: true,
    },
  });

  // STEP 4: Generate signed URLs for each version
  const token = crypto
    .createHmac("sha256", PDF_SECRET)
    .update(`${documentId}:${userId}`)
    .digest("hex");

  return {
    versions: versions.map((v) => ({
      ...v,
      pdfUrl: `/pdfs/version/read/${documentId}/${v.id}?userId=${userId}&token=${token}`,
      isCurrentUser: v.user?.id === userId,
    })),
  };
};
