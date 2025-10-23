import type {
  FolderType,
  Project,
  ProjectTreeNode,
  ProjectType,
} from "@/types/project.types";
import type { useReactTable } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// The button wich user choose color contain check and we change the color of the check depend on the color choosed: check -> (white or black)
export const isColorLight = (hex: string) => {
  let r = 0,
    g = 0,
    b = 0;

  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }

  // Perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 186; // Higher = lighter
};

export const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const resolveNestedFolder = (
  root: ProjectType,
  path: { id: string }[]
) => {
  let current: FolderType | ProjectType | undefined = root;
  for (const level of path) {
    current = current?.folders?.find((f) => f.id === level.id);
  }
  return current;
};

export function getCommonTagsFromSelectedRows<T>(
  table: ReturnType<typeof useReactTable<T>>
) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  // If no rows are selected, return an empty array
  if (selectedRows.length === 0) return [];

  // Get tags from the first row (or empty array if null/undefined)
  const firstRowTags = (selectedRows[0].original as Project).tags || [];
  let commonTags = [...firstRowTags]; // Start with the first row's tags

  // Compare with tags from other rows
  for (let i = 1; i < selectedRows.length; i++) {
    const currentRowTags = (selectedRows[i].original as Project).tags || [];

    // Keep only tags that exist in both `commonTags` and the current row's tags
    commonTags = commonTags.filter((tag1) =>
      currentRowTags.some((tag2) => tag1.text === tag2.text)
    );

    // Early exit if no common tags left
    if (commonTags.length === 0) break;
  }

  return commonTags;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export const checkFolderExists = (
  nodes: ProjectTreeNode[],
  folderName: string,
  parentFolderId: string | null
): boolean => {
  if (!parentFolderId) {
    // Check at root level
    return nodes.some(
      (node) =>
        node.type === "folder" &&
        node.name.toLowerCase() === folderName.toLowerCase()
    );
  }

  // Check inside parent folder
  const findInTree = (nodes: ProjectTreeNode[]): boolean => {
    for (const node of nodes) {
      if (node.id === parentFolderId && node.subChild) {
        return node.subChild.some(
          (child) =>
            child.type === "folder" &&
            child.name.toLowerCase() === folderName.toLowerCase()
        );
      }
      if (node.subChild && findInTree(node.subChild)) {
        return true;
      }
    }
    return false;
  };

  return findInTree(nodes);
};

export const checkFileExists = (
  nodes: ProjectTreeNode[],
  fileName: string,
  parentFolderId: string | null
): boolean => {
  if (!parentFolderId) {
    // Check at root level
    return nodes.some(
      (node) =>
        node.type === "file" &&
        node.name.toLowerCase() === fileName.toLowerCase()
    );
  }

  // Check inside parent folder
  const findInTree = (nodes: ProjectTreeNode[]): boolean => {
    for (const node of nodes) {
      if (node.id === parentFolderId && node.subChild) {
        return node.subChild.some(
          (child) =>
            child.type === "file" &&
            child.name.toLowerCase() === fileName.toLowerCase()
        );
      }
      if (node.subChild && findInTree(node.subChild)) {
        return true;
      }
    }
    return false;
  };

  return findInTree(nodes);
};
