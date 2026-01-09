import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isTextNode,
  $isElementNode,
  type ElementFormatType,
} from "lexical";
import type { ColumnsNodeJSON, EditorDocument, TextNode } from "./RichEditor";
import { ColumnNode, ColumnsNode } from "./lexicalPluginVer2";

export function importFromJSON(doc: EditorDocument) {
  const root = $getRoot();
  root.clear();

  doc.nodes.forEach((node) => {
    /* ---------- COLUMNS ---------- */
    if (node.type === "columns") {
      const columnsNode = new ColumnsNode(node.count);

      node.columns.forEach((col) => {
        const column = new ColumnNode();

        col.children.forEach((t) => {
          const textNode = $createTextNode(t.content);
          if (t.styles?.bold) {
            textNode.toggleFormat("bold");
          }
          column.append(textNode);
        });

        columnsNode.append(column);
      });

      root.append(columnsNode);
      root.append($createParagraphNode()); // exit paragraph
      return;
    }

    /* ---------- PARAGRAPH ---------- */
    if (node.type === "paragraph") {
      const paragraph = $createParagraphNode();

      if (node.alignment) {
        paragraph.setFormat(node.alignment as ElementFormatType);
      }

      node.children.forEach((t) => {
        const textNode = $createTextNode(t.content);
        if (t.styles?.bold) {
          textNode.toggleFormat("bold");
        }
        paragraph.append(textNode);
      });

      root.append(paragraph);
    }
  });
}

export function exportToJSON(): EditorDocument {
  const nodes: EditorDocument["nodes"] = [];

  $getRoot()
    .getChildren()
    .forEach((node) => {
      /* ---------- COLUMNS ---------- */
      if (node instanceof ColumnsNode) {
        const columns: ColumnsNodeJSON["columns"] = [];

        node.getChildren().forEach((col) => {
          if (!(col instanceof ColumnNode)) return;

          const children: TextNode[] = [];

          col.getChildren().forEach((c) => {
            if ($isTextNode(c)) {
              children.push({
                type: "text",
                content: c.getTextContent(),
                styles: c.hasFormat("bold") ? { bold: true } : undefined,
              });
            }
          });

          columns.push({
            type: "column",
            children,
          });
        });

        nodes.push({
          type: "columns",
          count: columns.length,
          columns,
        });

        return;
      }

      /* ---------- PARAGRAPH ---------- */
      if ($isElementNode(node)) {
        const children: TextNode[] = [];

        node.getChildren().forEach((c) => {
          if ($isTextNode(c)) {
            children.push({
              type: "text",
              content: c.getTextContent(),
              styles: c.hasFormat("bold") ? { bold: true } : undefined,
            });
          }
        });

        const format = node.getFormatType();
        const alignment = format && format !== "left" ? format : undefined;

        nodes.push({
          type: "paragraph",
          children,
          ...(alignment && {
            alignment: alignment as "left" | "center" | "right",
          }),
        });
      }
    });

  return { version: "1.0", nodes };
}
