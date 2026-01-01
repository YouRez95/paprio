import { useEffect, useState, useRef } from "react";
import { Info } from "lucide-react";
import type { JSONSchema } from "@/types/block.types";
import {
  useDocumentStore,
  type DocumentBlockConfig,
} from "@/store/documentStore";
import { FormField } from "./FormField";

export type formField = {
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

type DynamicFormRendererProps = {
  schema: JSONSchema;
  initialValues?: DocumentBlockConfig;
  onDraftChange: (data: DocumentBlockConfig) => void;
  blockId?: string;
};

export default function DynamicFormRenderer({
  schema,
  initialValues,
  onDraftChange,
  blockId,
}: DynamicFormRendererProps) {
  const { pushToHistory } = useDocumentStore();
  const [formData, setFormData] = useState<DocumentBlockConfig>(
    initialValues || {}
  );
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Track if this is user input or external update
  const isUserInputRef = useRef(false);

  // Track the state when field was focused to detect actual changes
  const fieldStateOnFocusRef = useRef<Record<string, any>>({});

  const formFields = () => {
    if (!schema.properties) return [];

    const propertyEntries = Object.entries(schema.properties);

    // If ui:order is specified, use it to order the fields
    if (schema["ui:order"] && Array.isArray(schema["ui:order"])) {
      const orderedFields: formField[] = [];
      const order = schema["ui:order"];

      // Add fields in the specified order
      order.forEach((fieldName) => {
        const fieldSchema = schema.properties![fieldName];
        if (fieldSchema) {
          orderedFields.push({
            name: fieldName,
            title: fieldSchema.title || fieldName,
            type: fieldSchema.type,
            description: fieldSchema.description,
            enum: fieldSchema.enum,
            default: fieldSchema.default,
            widget: fieldSchema["ui:widget"],
            placeholder: fieldSchema["ui:placeholder"],
            required: schema.required?.includes(fieldName) || false,
          });
        }
      });

      // Add any fields not in ui:order at the end
      propertyEntries.forEach(([fieldName, fieldSchema]) => {
        if (!order.includes(fieldName)) {
          orderedFields.push({
            name: fieldName,
            title: fieldSchema.title || fieldName,
            type: fieldSchema.type,
            description: fieldSchema.description,
            enum: fieldSchema.enum,
            default: fieldSchema.default,
            widget: fieldSchema["ui:widget"],
            placeholder: fieldSchema["ui:placeholder"],
            required: schema.required?.includes(fieldName) || false,
          });
        }
      });

      return orderedFields;
    }

    // Default: use the order from Object.entries
    return propertyEntries.map(([fieldName, fieldSchema]) => ({
      name: fieldName,
      title: fieldSchema.title || fieldName,
      type: fieldSchema.type,
      description: fieldSchema.description,
      enum: fieldSchema.enum,
      default: fieldSchema.default,
      widget: fieldSchema["ui:widget"],
      placeholder: fieldSchema["ui:placeholder"],
      required: schema.required?.includes(fieldName) || false,
    }));
  };

  const validateField = (value: any, field: formField) => {
    if (field.required && (!value || value === "")) {
      return `${field.title} is required`;
    }
    return null;
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    isUserInputRef.current = true; // Mark as user input

    setFormData((prev) => {
      const next = { ...prev, [fieldName]: value };

      // Defer onDraftChange to avoid setState during render
      queueMicrotask(() => {
        onDraftChange(next);
      });

      return next;
    });

    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    const field = formFields().find((f) => f.name === fieldName);
    if (field) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: validateField(value, field),
      }));
    }
  };

  const handleFieldFocus = (fieldName: string) => {
    // Save the current value when field gets focus
    fieldStateOnFocusRef.current[fieldName] = formData[fieldName];
  };

  const handleFieldBlur = (fieldName: string) => {
    // Only push to history if the value actually changed
    const valueOnFocus = fieldStateOnFocusRef.current[fieldName];
    const currentValue = formData[fieldName];

    if (JSON.stringify(valueOnFocus) !== JSON.stringify(currentValue)) {
      // Defer pushToHistory to avoid setState during render
      queueMicrotask(() => {
        pushToHistory(blockId);
      });
    }

    // Clean up
    delete fieldStateOnFocusRef.current[fieldName];
  };

  // CRITICAL: Update form data when initialValues change from external source (undo/redo)
  // But ONLY if it's not from user input to prevent focus loss
  useEffect(() => {
    if (!isUserInputRef.current && initialValues) {
      const hasChanged =
        JSON.stringify(formData) !== JSON.stringify(initialValues);

      if (hasChanged) {
        setFormData(initialValues);
        // Reset errors and touched state on external update
        setErrors({});
        setTouched({});
      }
    }

    // Reset the flag after checking
    isUserInputRef.current = false;
  }, [initialValues]); // Only depend on initialValues

  const fields = formFields();

  if (!schema.properties || fields.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Info size={28} className="mx-auto mb-3 text-gray-400" />
        <p>No configuration options available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <FormField
          key={field.name}
          field={field}
          value={formData[field.name]}
          error={errors[field.name]}
          touched={touched[field.name]}
          onChange={(value) => handleFieldChange(field.name, value)}
          onFocus={() => handleFieldFocus(field.name)}
          onBlur={() => handleFieldBlur(field.name)}
        />
      ))}
    </div>
  );
}
