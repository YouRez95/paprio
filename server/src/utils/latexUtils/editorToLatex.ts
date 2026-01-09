// utils/editorToLatex.ts

export type ColumnNode = {
  type: "column";
  children: TextNode[];
};

export type TextNode = {
  type: "text";
  content: string;
  styles?: TextStyle;
};

type TextStyle = {
  bold?: boolean;
};

export type ColumnsNode = {
  type: "columns";
  count: number;
  columns: ColumnNode[];
};

export type ParagraphNode = {
  type: "paragraph";
  alignment?: "left" | "center" | "right";
  children: TextNode[];
};

export type EditorNode = ParagraphNode | ColumnsNode;

export type EditorDocument = {
  version: "1.0";
  nodes: EditorNode[];
};

/**
 * Converts an EditorDocument to LaTeX formatted text
 */
export function convertEditorDocumentToLatex(
  doc: EditorDocument | string | any
): string {
  // Handle if it's still a JSON string
  let editorDoc: EditorDocument;

  if (typeof doc === "string") {
    try {
      editorDoc = JSON.parse(doc);
    } catch (e) {
      return escapeLaTeXText(doc);
    }
  } else if (doc && typeof doc === "object") {
    editorDoc = doc as EditorDocument;
  } else {
    return "";
  }

  // Validate structure
  if (
    !editorDoc.nodes ||
    !Array.isArray(editorDoc.nodes) ||
    editorDoc.nodes.length === 0
  ) {
    return "";
  }

  // Helper: detect block-level LaTeX
  const isBlockLatex = (p: string) =>
    /^\\begin\{.+?\}[\s\S]*?\\end\{.+?\}$/.test(p.trim());

  // Convert each paragraph
  const latexParagraphs = editorDoc.nodes
    .map((node) => {
      // if (
      //   !paragraph.children ||
      //   !Array.isArray(paragraph.children) ||
      //   paragraph.children.length === 0
      // ) {
      //   return "";
      // }

      // const latexTexts = paragraph.children.map((textNode) => {
      //   let text = textNode.content || "";

      //   text = escapeLaTeXText(text);

      //   if (textNode.styles?.bold) {
      //     text = `\\textbf{${text}}`;
      //   }

      //   return text;
      // });

      // const paragraphContent = latexTexts.join("");
      // const alignment = paragraph.alignment || "left";

      // if (alignment === "center") {
      //   return `\\begin{center}${paragraphContent}\\end{center}`;
      // }

      // if (alignment === "right") {
      //   return `\\begin{flushright}${paragraphContent}\\end{flushright}`;
      // }

      // return paragraphContent;
      if (node.type === "paragraph") {
        return paragraphToLatex(node);
      }

      if (node.type === "columns") {
        return columnsToLatex(node);
      }

      return "";
    })
    .filter((p) => p.trim().length > 0);

  // Join paragraphs with \newline only between non-block paragraphs
  const result = latexParagraphs
    .reduce((acc: string[], curr, index, arr) => {
      acc.push(curr);

      const next = arr[index + 1];
      if (!next) return acc;

      const currIsBlock = isBlockLatex(curr);
      const nextIsBlock = isBlockLatex(next);

      if (!currIsBlock && !nextIsBlock) {
        acc.push("\\newline");
      }

      return acc;
    }, [])
    .join(" ");

  return result;
}

/**
 * Escapes special LaTeX characters in text
 */
function escapeLaTeXText(text: string): string {
  if (!text) return "";

  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/\n/g, " "); // Convert newlines within text to spaces
}

/**
 * Checks if a value is an EditorDocument object
 */
export function isEditorDocument(value: any): boolean {
  return (
    value &&
    typeof value === "object" &&
    value.version === "1.0" &&
    Array.isArray(value.nodes)
  );
}

/**
 * Converts all EditorDocument fields in a config object based on schema
 */
export function convertEditorFieldsInConfig(
  config: Record<string, any>,
  configSchema: any
): Record<string, any> {
  console.log("configSchema nodes", JSON.stringify(config.content.nodes));
  const processed = { ...config };

  if (!configSchema || !configSchema.properties) {
    return processed;
  }

  // Iterate through schema to find textarea fields
  for (const [key, schema] of Object.entries(
    configSchema.properties as Record<string, any>
  )) {
    if (schema["ui:widget"] === "textarea" && processed[key] != null) {
      // Convert EditorDocument to LaTeX
      processed[key] = convertEditorDocumentToLatex(processed[key]);
    }
  }

  return processed;
}

function columnsToLatex(node: ColumnsNode): string {
  const colsContent = node.columns
    .map((col) => textNodesToLatex(col.children))
    .filter(Boolean)
    .join(" \\par\n");

  if (!colsContent) return "";

  return `
\\begin{multicols}{${node.count}}
${colsContent}
\\end{multicols}
`.trim();
}

function paragraphToLatex(p: ParagraphNode): string {
  if (!p.children || p.children.length === 0) return "";

  const content = textNodesToLatex(p.children);
  const alignment = p.alignment || "left";

  if (alignment === "center") {
    return `\\begin{center}${content}\\end{center}`;
  }

  if (alignment === "right") {
    return `\\begin{flushright}${content}\\end{flushright}`;
  }

  return content;
}

function textNodesToLatex(textNodes: TextNode[]): string {
  return textNodes
    .map((textNode) => {
      let text = escapeLaTeXText(textNode.content || "");

      if (textNode.styles?.bold) {
        text = `\\textbf{${text}}`;
      }

      return text;
    })
    .join("");
}
