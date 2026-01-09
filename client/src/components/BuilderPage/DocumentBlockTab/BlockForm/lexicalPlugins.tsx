import {
  COMMAND_PRIORITY_EDITOR,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
} from "lexical";
import { INSERT_COLUMNS_COMMAND } from "./RichEditor";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export function MultiColumnPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const unregisterInsert = editor.registerCommand(
      INSERT_COLUMNS_COMMAND,
      (columnCount: number) => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          // Create container paragraph node
          const container = $createParagraphNode();

          // Create individual column nodes
          for (let i = 0; i < columnCount; i++) {
            const column = $createParagraphNode();
            const placeholder = $createTextNode(`Column ${i + 1}`);
            column.append(placeholder);
            container.append(column);
          }

          // Create an empty paragraph after columns for easy exit
          const exitParagraph = $createParagraphNode();

          // Insert the container and exit paragraph
          selection.insertNodes([container, exitParagraph]);

          // Apply styling to container and columns after insertion
          setTimeout(() => {
            const containerKey = container.getKey();
            const containerDOM = editor.getElementByKey(containerKey);

            if (containerDOM) {
              // Style the container as a grid
              containerDOM.style.display = "grid";
              containerDOM.style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`;
              containerDOM.style.gap = "16px";
              containerDOM.style.marginTop = "16px";
              containerDOM.style.marginBottom = "16px";
              containerDOM.setAttribute("data-column-container", "true");

              // Style each column
              const columns = containerDOM.querySelectorAll("p");
              columns.forEach((colDOM, index) => {
                colDOM.style.minHeight = "100px";
                colDOM.style.padding = "12px";
                colDOM.style.border = "2px dashed #e5e7eb";
                colDOM.style.borderRadius = "6px";
                colDOM.style.transition = "all 0.2s ease";
                colDOM.style.cursor = "text";
                colDOM.setAttribute("data-column", "true");
                colDOM.setAttribute("data-column-index", String(index + 1));

                // Add hover effect
                colDOM.addEventListener("mouseenter", () => {
                  if (document.activeElement !== colDOM) {
                    colDOM.style.borderColor = "#9ca3af";
                    colDOM.style.backgroundColor = "#f9fafb";
                  }
                });

                colDOM.addEventListener("mouseleave", () => {
                  if (document.activeElement !== colDOM) {
                    colDOM.style.borderColor = "#e5e7eb";
                    colDOM.style.backgroundColor = "transparent";
                  }
                });

                // Add focus/blur event listeners for visual feedback
                colDOM.addEventListener("focus", () => {
                  colDOM.style.borderColor = "#3b82f6";
                  colDOM.style.backgroundColor = "#eff6ff";
                });

                colDOM.addEventListener("blur", () => {
                  colDOM.style.borderColor = "#e5e7eb";
                  colDOM.style.backgroundColor = "transparent";
                });

                // Clear placeholder text on first edit
                colDOM.addEventListener(
                  "input",
                  function clearPlaceholder() {
                    const text = colDOM.textContent?.trim();
                    if (text && text.startsWith("Column ")) {
                      colDOM.textContent = "";
                    }
                    colDOM.removeEventListener("input", clearPlaceholder);
                  },
                  { once: true }
                );

                // Handle keyboard events inside columns
                colDOM.addEventListener("keydown", (e) => {
                  // Prevent Lexical from handling Enter inside columns
                  if (e.key === "Enter") {
                    e.stopPropagation();

                    if (e.shiftKey) {
                      // Shift+Enter: Exit to paragraph below columns
                      e.preventDefault();

                      const exitParaDOM = editor.getElementByKey(
                        exitParagraph.getKey()
                      );
                      if (exitParaDOM) {
                        exitParaDOM.focus();

                        // Place cursor at the start
                        const range = document.createRange();
                        const sel = window.getSelection();
                        range.selectNodeContents(exitParaDOM);
                        range.collapse(true);
                        sel?.removeAllRanges();
                        sel?.addRange(range);
                      }
                    } else {
                      // Regular Enter: Add line break inside column (native browser behavior)
                      // Don't preventDefault - let the browser handle it naturally
                    }
                  }

                  // Prevent other Lexical shortcuts from affecting column content
                  if ((e.ctrlKey || e.metaKey) && e.key !== "b") {
                    // Allow bold (Ctrl+B) but stop other shortcuts
                    e.stopPropagation();
                  }
                });
              });
            }

            // Focus the first column
            const firstColumn = containerDOM?.querySelector(
              '[data-column="true"]'
            ) as HTMLElement;
            if (firstColumn) {
              setTimeout(() => {
                firstColumn.focus();
                // Place cursor at the end
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(firstColumn);
                range.collapse(false);
                sel?.removeAllRanges();
                sel?.addRange(range);
              }, 50);
            }
          }, 0);
        });

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );

    return () => {
      unregisterInsert();
    };
  }, [editor]);

  return null;
}
