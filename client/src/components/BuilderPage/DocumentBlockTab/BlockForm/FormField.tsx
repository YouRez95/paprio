import { DismissableLayer } from "@radix-ui/react-dismissable-layer";
import { useEffect, useState, useRef } from "react";
import { Info, AlertCircle, Paintbrush, Check, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { Label } from "@/components/ui/label";
import RichEditor, { type EditorDocument } from "./RichEditor";

// Update the interface to properly type values based on widget type
interface FormFieldProps {
  field: {
    name: string;
    title: string;
    type: string;
    description: string | undefined;
    enum: string[] | undefined;
    default: string;
    widget: string;
    placeholder: string | undefined;
    required: boolean;
  };

  value: string | boolean | EditorDocument;
  onChange: (value: string | boolean | EditorDocument) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error: string | null;
  touched: boolean;
}

export const FormField = ({
  field,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  touched,
}: FormFieldProps) => {
  const [showError, setShowError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorContent, setEditorContent] = useState<EditorDocument>({
    version: "1.0",
    nodes: [],
  });

  useEffect(() => {
    setShowError(touched && !!error);
  }, [touched, error]);

  // Only parse EditorDocument for textarea widgets
  useEffect(() => {
    if (field.widget === "textarea") {
      try {
        if (typeof value === "string") {
          // If value is a string, try to parse it as JSON
          const parsed = value
            ? JSON.parse(value)
            : { version: "1.0", nodes: [] };
          setEditorContent(parsed);
        } else if (value && typeof value === "object" && "version" in value) {
          // If value is already an EditorDocument
          setEditorContent(value as EditorDocument);
        } else {
          // Fallback to empty document
          setEditorContent({ version: "1.0", nodes: [] });
        }
      } catch (e) {
        console.error("Failed to parse editor content:", e);
        setEditorContent({ version: "1.0", nodes: [] });
      }
    }
  }, [value, field.widget]);

  const handleEditorOpen = () => {
    setEditorOpen(true);
    if (onFocus) onFocus();
  };

  const handleEditorSave = () => {
    onChange(editorContent);
    setEditorOpen(false);
    if (onBlur) onBlur();
  };

  const handleEditorCancel = () => {
    // Restore original content
    if (field.widget === "textarea") {
      try {
        if (typeof value === "string") {
          const parsed = value
            ? JSON.parse(value)
            : { version: "1.0", nodes: [] };
          setEditorContent(parsed);
        } else if (value && typeof value === "object" && "version" in value) {
          setEditorContent(value as EditorDocument);
        }
      } catch (e) {
        setEditorContent({ version: "1.0", nodes: [] });
      }
    }
    setEditorOpen(false);
    if (onBlur) onBlur();
  };

  // Helper function to extract preview text from EditorDocument
  const getPreviewText = (doc: EditorDocument): string => {
    for (const node of doc.nodes) {
      if (node.type === "paragraph" && node.children.length > 0) {
        return node.children.map((c) => c.content).join("");
      }

      if (node.type === "columns") {
        for (const column of node.columns) {
          if (column.children.length > 0) {
            return column.children.map((c) => c.content).join("");
          }
        }
      }
    }

    return "";
  };

  const baseInputClasses = `w-full px-3 py-2 text-sm border rounded-md transition-all duration-200 ${
    showError
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/50"
      : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
  } focus:outline-none`;

  const renderField = () => {
    switch (field.widget) {
      case "input":
        return (
          <Input
            type="text"
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={field.type === "string" ? (value as string) || "" : ""}
            onChange={(e: any) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            className={baseInputClasses}
          />
        );

      case "textarea":
        const previewText = getPreviewText(editorContent);

        return (
          <>
            <Button
              type="button"
              onClick={handleEditorOpen}
              className={`w-full px-2 py-5 text-sm border rounded-md transition-all duration-200 text-left ${
                showError
                  ? "border-red-400 hover:border-red-500 bg-red-50/50"
                  : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
              } focus:outline-none focus:ring-2 focus:ring-blue-100`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText size={16} className="text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {previewText ? (
                      <div className="text-gray-700 truncate">
                        {previewText.substring(0, 50)}
                        {previewText.length > 50 && "..."}
                      </div>
                    ) : (
                      <div className="text-gray-400">
                        {field.placeholder || "Click to open editor"}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0 ml-2">
                  {previewText ? `${previewText.length} chars` : "Empty"}
                </div>
              </div>
            </Button>

            {editorOpen && (
              <RichEditor
                editorContent={editorContent}
                setEditorContent={setEditorContent}
                editorOpen={editorOpen}
                setEditorOpen={setEditorOpen}
                field={field}
                handleEditorCancel={handleEditorCancel}
                handleEditorSave={handleEditorSave}
              />
            )}
          </>
        );

      case "select":
        return (
          <Select
            value={field.type === "string" ? (value as string) : field.default}
            onValueChange={(val: string) => {
              onChange(val);
              if (onBlur) setTimeout(onBlur, 0);
            }}
          >
            <SelectTrigger
              className={`w-full px-3 py-2 text-sm border rounded-md cursor-pointer ${
                showError
                  ? "border-red-400 bg-red-50/50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <SelectValue
                placeholder={
                  field.type === "string"
                    ? (value as string)
                    : field.default || `Select ${field.title.toLowerCase()}`
                }
              />
            </SelectTrigger>
            <SelectContent>
              {field.enum?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "color":
        return (
          <ColorPickerWithPresets
            value={field.type === "string" ? (value as string) : field.default}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={field.placeholder}
            showError={showError}
          />
        );

      case "checkbox":
        return (
          <label className="flex items-start gap-3 py-2 px-3 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
            <Checkbox
              id={field.name}
              checked={field.type === "boolean" ? (value as boolean) : false}
              onCheckedChange={(checked: boolean) => {
                onChange(checked);
                if (onBlur) setTimeout(onBlur, 0);
              }}
              className={`mt-0.5 h-4 w-4 rounded border-2 ${
                showError ? "border-red-400" : "border-gray-300"
              }`}
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-800">
                {field.title}
              </div>
              {field.description && (
                <div className="text-xs text-gray-500 mt-0.5">
                  {field.description}
                </div>
              )}
            </div>
          </label>
        );

      default:
        return null;
    }
  };

  if (field.widget === "checkbox") {
    return (
      <div className="space-y-1.5">
        {renderField()}
        {showError && (
          <div className="flex items-start gap-1.5 text-red-600 text-xs px-3">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={field.name}
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide"
      >
        <span className="flex-1">{field.title}</span>
        {field.required && <span className="text-red-500">*</span>}
        {field.description && (
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Info size={14} />
            </button>
            {showTooltip && (
              <div className="absolute right-0 top-full mt-1 w-64 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-50">
                {field.description}
                <div className="absolute bottom-full right-2 border-4 border-transparent border-b-gray-900"></div>
              </div>
            )}
          </div>
        )}
      </label>

      {renderField()}

      {showError && (
        <div className="flex items-start gap-1.5 text-red-600 text-xs">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

const ColorPickerWithPresets = ({
  value,
  onChange,
  onBlur,
  placeholder,
  showError,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  showError: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const initialValueRef = useRef(value);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsOpen(false);

    if (onBlur && value !== initialValueRef.current) {
      onBlur();
    }
  };

  useEffect(() => {
    if (isOpen) {
      initialValueRef.current = value;
    }
  }, [isOpen, value]);

  const colorPresets = [
    { color: "#ef4444", name: "Red" },
    { color: "#f97316", name: "Orange" },
    { color: "#f59e0b", name: "Amber" },
    { color: "#eab308", name: "Yellow" },
    { color: "#84cc16", name: "Lime" },
    { color: "#22c55e", name: "Green" },
    { color: "#10b981", name: "Emerald" },
    { color: "#14b8a6", name: "Teal" },
    { color: "#06b6d4", name: "Cyan" },
    { color: "#0ea5e9", name: "Sky" },
    { color: "#3b82f6", name: "Blue" },
    { color: "#6366f1", name: "Indigo" },
    { color: "#8b5cf6", name: "Violet" },
    { color: "#a855f7", name: "Purple" },
    { color: "#d946ef", name: "Fuchsia" },
    { color: "#ec4899", name: "Pink" },
    { color: "#f43f5e", name: "Rose" },
    { color: "#64748b", name: "Slate" },
  ];

  const handleColorSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
    setIsOpen(false);

    if (onBlur && color !== initialValueRef.current) {
      onBlur();
    }
  };

  const buttonClasses = `flex items-center gap-2 px-3 py-2 border-2 rounded-lg transition-all ${
    showError
      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50"
      : "border-gray-300 hover:border-blue-400"
  }`;

  return (
    <div className="relative w-full" ref={pickerRef}>
      <Button
        variant={"ghost"}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${buttonClasses} w-full`}
      >
        <div
          className="w-6 h-6 rounded border-2 border-gray-300 flex-shrink-0"
          style={{ backgroundColor: value || "#3b82f6" }}
        />
        <span className="text-sm font-medium text-gray-700 flex-1 text-left truncate">
          {value || "Select color"}
        </span>
        <Paintbrush size={16} className="text-gray-500 flex-shrink-0" />
      </Button>

      {isOpen && (
        <DismissableLayer
          onPointerDownOutside={(event) => {
            const target = event.target as HTMLElement;

            if (target.closest("[data-radix-popper-content-wrapper]")) {
              event.preventDefault();
              return;
            }

            handleClose();
          }}
          onEscapeKeyDown={handleClose}
        >
          <div className="absolute bg-white bottom-full z-20 mt-2 p-3 rounded-lg shadow-xl border border-gray-200 w-full min-w-[280px]">
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Quick Colors
              </label>
              <div className="grid grid-cols-6 gap-2">
                {colorPresets.map(({ color, name }) => (
                  <Button
                    key={color}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    className="relative w-full aspect-square rounded-md border-2 border-gray-200 hover:border-blue-400 hover:scale-110 transition-all"
                    style={{ backgroundColor: color }}
                    title={name}
                  >
                    {value === color && (
                      <Check
                        size={16}
                        className="absolute inset-0 m-auto text-white drop-shadow-md"
                        strokeWidth={3}
                      />
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t">
              <Label className="block text-xs font-semibold text-gray-700 mb-2">
                Custom Color
              </Label>
              <div className="flex gap-2 items-center">
                <Popover
                  modal={true}
                  open={popoverOpen}
                  onOpenChange={setPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <div
                      className="w-8 h-8 rounded-sm border-2 cursor-pointer flex items-center justify-center text-xs"
                      style={{
                        backgroundColor: customColor || "#fff",
                      }}
                    />
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0 w-fit"
                    align="start"
                    side="top"
                  >
                    <HexColorPicker
                      color={customColor || "#ffffff"}
                      onChange={setCustomColor}
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  readOnly
                  type="text"
                  value={customColor}
                  placeholder={placeholder || "#000000"}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <Button
                type="button"
                onClick={() => handleColorSelect(customColor)}
                className="w-full mt-2 px-3 py-2 text-white text-sm font-medium rounded-md transition-colors"
              >
                Apply Custom Color
              </Button>
            </div>
          </div>
        </DismissableLayer>
      )}
    </div>
  );
};
