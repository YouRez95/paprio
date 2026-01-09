import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createLineBreakNode,
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  ElementNode,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ENTER_COMMAND,
  type NodeKey,
  type SerializedElementNode,
} from "lexical";
import { useEffect } from "react";
import { INSERT_COLUMNS_COMMAND } from "./RichEditor";

/* =======================
   ColumnsNode (container)
======================= */

export type SerializedColumnsNode = {
  type: "columns";
  version: 1;
  count: number;
} & SerializedElementNode;

export class ColumnsNode extends ElementNode {
  __count: number;

  static getType() {
    return "columns";
  }

  static clone(node: ColumnsNode) {
    return new ColumnsNode(node.__count, node.__key);
  }

  constructor(count: number, key?: NodeKey) {
    super(key);
    this.__count = count;
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.dataset.columns = "true";
    div.style.display = "grid";
    div.style.gridTemplateColumns = `repeat(${this.__count}, 1fr)`;
    div.style.gap = "16px";
    div.style.margin = "16px 0";
    return div;
  }

  updateDOM(): false {
    return false;
  }

  static importJSON(serializedNode: SerializedColumnsNode): ColumnsNode {
    return new ColumnsNode(serializedNode.count);
  }

  exportJSON(): SerializedColumnsNode {
    return {
      type: "columns",
      version: 1,
      count: this.__count,
      children: this.getChildren().map((child) => child.exportJSON()),
      direction: this.getDirection(),
      format: this.getFormatType(),
      indent: this.getIndent(),
    };
  }
}

/* =======================
   ColumnNode (single col)
======================= */

export type SerializedColumnNode = {
  type: "column";
  version: 1;
} & SerializedElementNode;

export class ColumnNode extends ElementNode {
  static getType() {
    return "column";
  }

  static clone(node: ColumnNode) {
    return new ColumnNode(node.__key);
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.dataset.column = "true";
    div.style.minHeight = "100px";
    div.style.padding = "12px";
    div.style.border = "2px dashed #e5e7eb";
    div.style.borderRadius = "6px";
    div.style.cursor = "text";
    return div;
  }

  updateDOM(): false {
    return false;
  }

  static importJSON(): ColumnNode {
    return new ColumnNode();
  }

  exportJSON(): SerializedElementNode {
    return {
      type: "column",
      version: 1,
      children: this.getChildren().map((child) => child.exportJSON()),
      direction: this.getDirection(),
      format: this.getFormatType(),
      indent: this.getIndent(),
    };
  }
}

/* =======================
   Plugin
======================= */

export function MultiColumnPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    /* Insert columns */
    const unregisterInsert = editor.registerCommand(
      INSERT_COLUMNS_COMMAND,
      (count: number) => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          const columns = new ColumnsNode(count);

          for (let i = 0; i < count; i++) {
            const column = new ColumnNode();
            column.append($createTextNode(""));
            columns.append(column);
          }

          selection.insertNodes([
            columns,
            $createParagraphNode(), // exit paragraph
          ]);
        });

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    /* Enter → new line inside column */
    const unregisterEnter = editor.registerCommand(
      KEY_ENTER_COMMAND,
      (e) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;

        const anchorNode = selection.anchor.getNode();
        const column = anchorNode.getParent();
        if (!(column instanceof ColumnNode)) return false;

        e?.preventDefault();
        selection.insertNodes([$createLineBreakNode()]);
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    /* ArrowDown → exit columns at bottom */
    const unregisterArrowDown = editor.registerCommand(
      KEY_ARROW_DOWN_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;

        const anchorNode = selection.anchor.getNode();
        const column = anchorNode.getParent();
        if (!(column instanceof ColumnNode)) return false;

        const isAtEnd =
          selection.anchor.offset === anchorNode.getTextContentSize();

        if (!isAtEnd) return false;

        const columns = column.getParent();
        if (!columns) return false;

        const nextBlock = columns.getNextSibling();
        if (!nextBlock) return false;

        nextBlock.selectStart();
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    return () => {
      unregisterInsert();
      unregisterEnter();
      unregisterArrowDown();
    };
  }, [editor]);

  return null;
}
