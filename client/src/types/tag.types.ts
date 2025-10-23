export interface Tag {
  id: string;
  text: string;
  color: string;
}

export interface CreateTagInput {
  color: string;
  tagName: string;
  projectIds: string[];
}

export interface ToggleTags {
  type: "add" | "remove";
  projectIds: string[];
  tagId: string;
}
