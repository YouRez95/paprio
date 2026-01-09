import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Columns,
  ChevronDown,
} from "lucide-react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  createCommand,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  type EditorState,
  type LexicalCommand,
} from "lexical";

import { useEffect, useRef } from "react";
import { exportToJSON, importFromJSON } from "./lexicalHelpers";
import {
  ColumnNode,
  ColumnsNode,
  MultiColumnPlugin,
} from "./lexicalPluginVer2";
import type { EditorDocument } from "./lexicalTypes";

// New command for inserting columns
export const INSERT_COLUMNS_COMMAND: LexicalCommand<number> = createCommand();

type RichEditorProps = {
  editorOpen: boolean;
  setEditorOpen: (open: boolean) => void;
  field: {
    title: string;
    description?: string;
  };
  editorContent: EditorDocument;
  setEditorContent: (content: EditorDocument) => void;
  handleEditorCancel: () => void;
  handleEditorSave: () => void;
};

export default function RichEditor({
  editorOpen,
  setEditorOpen,
  field,
  editorContent,
  setEditorContent,
  handleEditorCancel,
  handleEditorSave,
}: RichEditorProps) {
  const theme = {
    paragraph: "leading-7",
    text: {
      bold: "font-bold",
      italic: "text-blue-500",
    },
    textAlign: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  };

  const initialConfig = {
    namespace: "DocumentEditor",
    theme,
    onError(error: Error) {
      throw error;
    },
    nodes: [ColumnsNode, ColumnNode],
  };

  return (
    <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
      <DialogContent className="max-h-[80vh] flex flex-col min-w-3xl">
        <DialogHeader>
          <DialogTitle>{field.title} Editor</DialogTitle>
          <DialogDescription>
            {field.description ||
              "Edit your content below. Use the toolbar to format text and insert multi-column layouts."}
          </DialogDescription>
        </DialogHeader>

        <LexicalComposer
          key={editorOpen ? "open" : "closed"}
          initialConfig={initialConfig}
        >
          <div className="flex-1 min-h-[400px] border border-gray-200 rounded-lg overflow-hidden flex flex-col">
            <Toolbar />
            <RichTextPlugin
              ErrorBoundary={({ children }: { children: React.ReactNode }) => (
                <div className="p-4 text-red-500">{children}</div>
              )}
              contentEditable={
                <ContentEditable className="flex-1 p-4 overflow-auto focus:outline-none" />
              }
              // placeholder={
              //   <div className="text-gray-400 pointer-events-none absolute top-14 left-5">
              //     Start typing or click "Insert Columns" to add a multi-column
              //     layout...
              //   </div>
              // }
            />

            <HistoryPlugin />
            <MultiColumnPlugin />
            <OnChangePlugin
              onChange={(editorState: EditorState) => {
                editorState.read(() => {
                  setEditorContent(exportToJSON());
                });
                console.log(editorState.toJSON());
              }}
            />

            <LoadInitialContent value={editorContent} />
          </div>
        </LexicalComposer>

        {/* Debug JSON */}
        <details className="text-xs mt-2">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
            Show JSON structure (for backend)
          </summary>
          <pre className="mt-2 bg-gray-50 p-3 rounded border max-h-32 overflow-auto text-xs">
            {JSON.stringify(editorContent, null, 2)}
          </pre>
        </details>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            {JSON.stringify(editorContent).length} characters
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEditorCancel}>
              Cancel
            </Button>
            <Button onClick={handleEditorSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowColumnMenu(false);
      }
    };

    if (showColumnMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showColumnMenu]);

  const insertColumns = (count: number) => {
    editor.dispatchCommand(INSERT_COLUMNS_COMMAND, count);
    setShowColumnMenu(false);
    editor.focus();
  };

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex gap-2 items-center">
      <Button
        size="sm"
        variant="outline"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        type="button"
        title="Bold (Ctrl+B)"
      >
        <Bold size={16} />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <Button
        size="sm"
        variant="outline"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        type="button"
        title="Align Left"
      >
        <AlignLeft size={16} />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
        type="button"
        title="Align Center"
      >
        <AlignCenter size={16} />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
        type="button"
        title="Align Right"
      >
        <AlignRight size={16} />
      </Button>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Column Insert Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowColumnMenu(!showColumnMenu)}
          type="button"
          className="flex items-center gap-1"
          title="Insert Multi-Column Layout"
        >
          <Columns size={16} />
          <span className="text-xs">Insert Columns</span>
          <ChevronDown
            size={12}
            className={`transition-transform ${
              showColumnMenu ? "rotate-180" : ""
            }`}
          />
        </Button>

        {showColumnMenu && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 flex gap-1 min-w-max">
            <Button
              size="sm"
              variant="outline"
              onClick={() => insertColumns(2)}
              type="button"
              className="flex items-center gap-1 hover:bg-blue-50"
              title="Insert 2 Columns"
            >
              <Columns size={16} />
              <span className="text-xs font-medium">2 Cols</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => insertColumns(3)}
              type="button"
              className="flex items-center gap-1 hover:bg-blue-50"
              title="Insert 3 Columns"
            >
              <Columns size={16} />
              <span className="text-xs font-medium">3 Cols</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => insertColumns(4)}
              type="button"
              className="flex items-center gap-1 hover:bg-blue-50"
              title="Insert 4 Columns"
            >
              <Columns size={16} />
              <span className="text-xs font-medium">4 Cols</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadInitialContent({ value }: { value: EditorDocument }) {
  const [editor] = useLexicalComposerContext();
  const isFirstRender = useRef(true);
  const initialContentRef = useRef<string>(JSON.stringify(value));

  useEffect(() => {
    const currentValueStr = JSON.stringify(value);

    if (isFirstRender.current) {
      editor.update(() => {
        importFromJSON(value);
      });
      isFirstRender.current = false;
      initialContentRef.current = currentValueStr;
    } else if (currentValueStr !== initialContentRef.current) {
      editor.update(() => {
        importFromJSON(value);
      });
      initialContentRef.current = currentValueStr;
    }
  }, [editor]);

  return null;
}
