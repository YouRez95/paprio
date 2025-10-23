import type { Tag } from "./tag.types";

export interface Owner {
  id: string;
  imageUrl: string | null;
  email: string;
  firstName: string;
  lastName: string;
}

export type ProjectRole = "ADMIN" | "EDITOR" | "VIEWER";

export interface Member {
  id: string;
  userId: string;
  role: ProjectRole;
  user: {
    id: string;
    email: string;
    imageUrl: string | null;
    firstName: string;
    lastName: string;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: Owner;
  userSettings: { isFavorite: boolean }[];
  members: Member[];
  _count: {
    members: number;
  };
  tags: Tag[] | [];
}

export interface GetProjectsInput {
  search: string;
  page: number;
  limit: number;
  tag?: string | undefined;
}

export interface GetProjects {
  projects: Project[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreateProjectInput {
  projectName: string;
  projectDescription?: string | undefined;
}

export type DocumentType = {
  id: string;
  title: string;
  folderId: string | null;
};

export type FolderType = {
  id: string;
  name: string;
  folders?: FolderType[];
  documents?: DocumentType[];
};

export type ProjectType = {
  id: string;
  name: string;
  folders?: FolderType[];
  documents?: DocumentType[];
};

type NestedFolder = { id: string; name: string; folders: NestedFolder[] };

export interface NestedProjects {
  id: string;
  name: string;
  folders?: NestedFolder[];
}

export type ProjectTreeNode = {
  id: string;
  name: string;
  type: "folder" | "file";
  expanded?: boolean;
  subChild?: ProjectTreeNode[];
};

export interface GetProjectById {
  project: {
    id: string;
    name: string;
    description: string | null;
    deletedAt: null;
    updatedAt: string;
    createdAt: string;
    role: ProjectRole;
    isFavorite: boolean;
  };
  projectTree: ProjectTreeNode[];
}
