type TextStyle = {
  bold?: boolean;
};

export type TextNode = {
  type: "text";
  content: string;
  styles?: TextStyle;
};

export type ParagraphNode = {
  type: "paragraph";
  children: TextNode[];
  alignment?: "left" | "center" | "right";
};

export type ColumnNodeJSON = {
  type: "column";
  children: TextNode[];
};

export type ColumnsNodeJSON = {
  type: "columns";
  count: number;
  columns: ColumnNodeJSON[];
};

export type EditorNode = ParagraphNode | ColumnsNodeJSON;

export type EditorDocument = {
  version: "1.0";
  nodes: EditorNode[];
};
