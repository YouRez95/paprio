// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { AlertCircle, Info, Paintbrush, Check } from "lucide-react";
// import { useEffect, useState, useRef } from "react";
// import { HexColorPicker } from "react-colorful";

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

  value: string | boolean;
  onChange: (value: string | boolean) => void;
  onFocus?: () => void; // Add onFocus callback
  onBlur?: () => void; // Add onBlur callback
  error: string | null;
  touched: boolean;
}

// export const FormField = ({
//   field,
//   value,
//   onChange,
//   onFocus,
//   onBlur,
//   error,
//   touched,
// }: FormFieldProps) => {
//   const [showError, setShowError] = useState(false);

//   useEffect(() => {
//     setShowError(touched && !!error);
//   }, [touched, error]);

//   const fieldClasses = `w-full px-2 py-1.5 border rounded-lg transition-all duration-200 ${
//     showError
//       ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50"
//       : "border-gray-300 focus:ring-1"
//   } focus:outline-none`;

//   const renderField = () => {
//     switch (field.widget) {
//       case "input":
//         return (
//           <Input
//             type="text"
//             id={field.name}
//             name={field.name}
//             placeholder={field.placeholder}
//             value={field.type === "string" ? (value as string) || "" : ""}
//             onChange={(e) => onChange(e.target.value)}
//             onFocus={onFocus} // Add onFocus handler
//             onBlur={onBlur} // Add onBlur handler
//             className={fieldClasses}
//           />
//         );

//       case "textarea":
//         return (
//           <Textarea
//             id={field.name}
//             name={field.name}
//             placeholder={field.placeholder}
//             value={field.type === "string" ? (value as string) || "" : ""}
//             onChange={(e) => onChange(e.target.value)}
//             onFocus={onFocus} // Add onFocus handler
//             onBlur={onBlur} // Add onBlur handler
//             className={`${fieldClasses} min-h-[100px] resize-y`}
//             rows={4}
//           />
//         );

//       case "select":
//         return (
//           <Select
//             value={field.type === "string" ? (value as string) : field.default}
//             onValueChange={(val) => {
//               onChange(val);
//               // For select, trigger onBlur immediately after change
//               if (onBlur) {
//                 setTimeout(onBlur, 0);
//               }
//             }}
//           >
//             <SelectTrigger
//               className={`w-full ${
//                 showError
//                   ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50"
//                   : ""
//               }`}
//             >
//               <SelectValue
//                 placeholder={`Select ${field.title.toLowerCase()}`}
//               />
//             </SelectTrigger>
//             <SelectContent>
//               {field.enum?.map((option) => (
//                 <SelectItem key={option} value={option}>
//                   {option}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         );

//       case "color":
//         return (
//           <ColorPickerWithPresets
//             value={field.type === "string" ? (value as string) : field.default}
//             onChange={onChange}
//             onBlur={onBlur}
//             placeholder={field.placeholder}
//             showError={showError}
//           />
//         );

//       case "checkbox":
//         return (
//           <div className="flex items-center space-x-3 py-2">
//             <Checkbox
//               id={field.name}
//               checked={field.type === "boolean" ? (value as boolean) : false}
//               onCheckedChange={(checked) => {
//                 onChange(checked);
//                 // For checkbox, trigger onBlur immediately after change
//                 if (onBlur) {
//                   setTimeout(onBlur, 0);
//                 }
//               }}
//               className={`h-5 w-5 ${
//                 showError
//                   ? "border-red-400 data-[state=checked]:bg-red-500"
//                   : ""
//               }`}
//             />
//             <label
//               htmlFor={field.name}
//               className="text-sm font-medium text-gray-700 cursor-pointer select-none"
//             >
//               {field.description || "Enable this option"}
//             </label>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   if (field.widget === "checkbox") {
//     return (
//       <div className="space-y-2">
//         <div className="flex items-start gap-2">
//           <div className="flex-1">{renderField()}</div>
//           {field.description && field.widget !== "checkbox" && (
//             <div className="group relative">
//               <Info
//                 size={16}
//                 className="text-gray-400 cursor-help hover:text-blue-500 transition-colors"
//               />
//               <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 max-w-xs whitespace-normal shadow-lg">
//                 {field.description}
//                 <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
//               </div>
//             </div>
//           )}
//         </div>

//         {showError && (
//           <div className="flex items-start gap-2 text-red-600 text-sm mt-1.5">
//             <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
//             <span>{error}</span>
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-2">
//       <label
//         htmlFor={field.name}
//         className="flex items-center gap-2 text-sm font-semibold text-gray-800"
//       >
//         {field.title}
//         {field.required && <span className="text-red-500 text-base">*</span>}
//         {field.description && (
//           <div className="group relative">
//             <Info
//               size={16}
//               className="text-gray-400 cursor-help hover:text-blue-500 transition-colors"
//             />
//             <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 min-w-40 whitespace-normal shadow-lg">
//               {field.description}
//               <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
//             </div>
//           </div>
//         )}
//       </label>

//       {renderField()}

//       {showError && (
//         <div className="flex items-start gap-2 text-red-600 text-sm mt-1.5">
//           <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
//           <span>{error}</span>
//         </div>
//       )}
//     </div>
//   );
// };

// // Color Picker Component with Presets
// const ColorPickerWithPresets = ({
//   value,
//   onChange,
//   onBlur,
//   placeholder,
//   showError,
// }: {
//   value: string;
//   onChange: (value: string) => void;
//   onBlur?: () => void;
//   placeholder?: string;
//   showError: boolean;
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [customColor, setCustomColor] = useState(value);
//   const initialValueRef = useRef(value);

//   // Update initial value when picker opens
//   useEffect(() => {
//     if (isOpen) {
//       initialValueRef.current = value;
//     }
//   }, [isOpen, value]);

//   const colorPresets = [
//     { color: "#ef4444", name: "Red" },
//     { color: "#f97316", name: "Orange" },
//     { color: "#f59e0b", name: "Amber" },
//     { color: "#eab308", name: "Yellow" },
//     { color: "#84cc16", name: "Lime" },
//     { color: "#22c55e", name: "Green" },
//     { color: "#10b981", name: "Emerald" },
//     { color: "#14b8a6", name: "Teal" },
//     { color: "#06b6d4", name: "Cyan" },
//     { color: "#0ea5e9", name: "Sky" },
//     { color: "#3b82f6", name: "Blue" },
//     { color: "#6366f1", name: "Indigo" },
//     { color: "#8b5cf6", name: "Violet" },
//     { color: "#a855f7", name: "Purple" },
//     { color: "#d946ef", name: "Fuchsia" },
//     { color: "#ec4899", name: "Pink" },
//     { color: "#f43f5e", name: "Rose" },
//     { color: "#64748b", name: "Slate" },
//   ];

//   const handleColorSelect = (color: string) => {
//     onChange(color);
//     setCustomColor(color);
//     setIsOpen(false);

//     // Trigger onBlur when color is selected (if value changed)
//     if (onBlur && color !== initialValueRef.current) {
//       onBlur();
//     }
//   };

//   const handleClose = () => {
//     setIsOpen(false);

//     // Trigger onBlur when closing (if value changed)
//     if (onBlur && value !== initialValueRef.current) {
//       onBlur();
//     }
//   };

//   const buttonClasses = `flex items-center gap-2 px-3 py-2 border-2 rounded-lg transition-all ${
//     showError
//       ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50"
//       : "border-gray-300 hover:border-blue-400"
//   }`;

//   return (
//     <div className="relative w-full">
//       <Button
//         variant={"ghost"}
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className={buttonClasses}
//       >
//         <div
//           className="w-6 h-6 rounded border-2 border-gray-300 flex-shrink-0"
//           style={{ backgroundColor: value || "#3b82f6" }}
//         />
//         <span className="text-sm font-medium text-gray-700 flex-1 text-left truncate">
//           {value || "Select color"}
//         </span>
//         <Paintbrush size={16} className="text-gray-500 flex-shrink-0" />
//       </Button>

//       {isOpen && (
//         <>
//           <div className="fixed inset-0 z-10" onClick={handleClose} />
//           <div className="absolute z-20 mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200 w-full min-w-[280px]">
//             <div className="mb-3">
//               <label className="block text-xs font-semibold text-gray-700 mb-2">
//                 Quick Colors
//               </label>
//               <div className="grid grid-cols-6 gap-2">
//                 {colorPresets.map(({ color, name }) => (
//                   <button
//                     key={color}
//                     type="button"
//                     onClick={() => handleColorSelect(color)}
//                     className="relative w-full aspect-square rounded-md border-2 border-gray-200 hover:border-blue-400 hover:scale-110 transition-all"
//                     style={{ backgroundColor: color }}
//                     title={name}
//                   >
//                     {value === color && (
//                       <Check
//                         size={16}
//                         className="absolute inset-0 m-auto text-white drop-shadow-md"
//                         strokeWidth={3}
//                       />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="pt-3 border-t">
//               <label className="block text-xs font-semibold text-gray-700 mb-2">
//                 Custom Color
//               </label>
//               <div className="flex gap-2 items-center">
//                 <Popover modal={true}>
//                   <PopoverTrigger asChild>
//                     <div
//                       className={
//                         "w-8 h-8 rounded-sm border-2 cursor-pointer flex items-center justify-center text-xs"
//                       }
//                       style={{
//                         backgroundColor: customColor || "#fff",
//                       }}
//                     />
//                   </PopoverTrigger>
//                   <PopoverContent
//                     className="p-0 w-fit"
//                     align="start"
//                     side="top"
//                   >
//                     <HexColorPicker
//                       color={customColor || "#ffffff"}
//                       onChange={setCustomColor}
//                     />
//                   </PopoverContent>
//                 </Popover>
//                 <Input
//                   readOnly
//                   type="text"
//                   value={customColor}
//                   placeholder={placeholder || "#000000"}
//                   className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 />
//               </div>
//               <Button
//                 type="button"
//                 onClick={() => handleColorSelect(customColor)}
//                 className="w-full mt-2 px-3 py-2 text-white text-sm font-medium rounded-md transition-colors"
//               >
//                 Apply Custom Color
//               </Button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };
import { DismissableLayer } from "@radix-ui/react-dismissable-layer";

import { useEffect, useState, useRef } from "react";
import { Info, AlertCircle, Paintbrush, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

// Mock UI components
// const Button = ({ children, className = "", onClick, type = "button", variant = "default" }: any) => (
//   <button
//     type={type}
//     onClick={onClick}
//     className={`${className} ${variant === "ghost" ? "hover:bg-gray-100" : "bg-blue-600 hover:bg-blue-700"}`}
//   >
//     {children}
//   </button>
// );

// const Input = ({ className = "", ...props }: any) => (
//   <input className={`${className}`} {...props} />
// );

// const Textarea = ({ className = "", ...props }: any) => (
//   <textarea className={`${className}`} {...props} />
// );

// const Checkbox = ({ className = "", checked, onCheckedChange, ...props }: any) => (
//   <input
//     type="checkbox"
//     className={`${className}`}
//     checked={checked}
//     onChange={(e) => onCheckedChange?.(e.target.checked)}
//     {...props}
//   />
// );

// const Select = ({ children, value, onValueChange }: any) => {
//   const [isOpen, setIsOpen] = useState(false);
//   return (
//     <div className="relative">
//       {children.map((child: any) => {
//         if (child.type.name === 'SelectTrigger') {
//           return <div key="trigger" onClick={() => setIsOpen(!isOpen)}>{child}</div>;
//         }
//         if (child.type.name === 'SelectContent' && isOpen) {
//           return (
//             <div key="content" className="absolute z-50 w-full">
//               {child}
//             </div>
//           );
//         }
//         return null;
//       })}
//     </div>
//   );
// };

// const SelectTrigger = ({ children, className }: any) => (
//   <div className={`flex items-center justify-between ${className}`}>
//     {children}
//     <ChevronDown size={16} className="text-gray-500" />
//   </div>
// );

// const SelectValue = ({ placeholder }: any) => (
//   <span className="text-sm text-gray-700">{placeholder}</span>
// );

// const SelectContent = ({ children }: any) => (
//   <div className="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
//     {children}
//   </div>
// );

// const SelectItem = ({ children, value, onClick }: any) => (
//   <div
//     className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
//     onClick={() => onClick?.(value)}
//   >
//     {children}
//   </div>
// );

// Enhanced FormField Component for Sidebar
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

  useEffect(() => {
    setShowError(touched && !!error);
  }, [touched, error]);

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
        return (
          <Textarea
            id={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={field.type === "string" ? (value as string) || "" : ""}
            onChange={(e: any) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            className={`${baseInputClasses} min-h-[80px] resize-y`}
            rows={3}
          />
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
                placeholder={value || `Select ${field.title.toLowerCase()}`}
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

// Compact Color Picker for Sidebar
// const ColorPickerCompact = ({ value, onChange, onBlur, showError }: any) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const initialValueRef = useRef(value);

//   useEffect(() => {
//     if (isOpen) initialValueRef.current = value;
//   }, [isOpen, value]);

//   const colorPresets = [
//     "#ef4444",
//     "#f97316",
//     "#f59e0b",
//     "#eab308",
//     "#84cc16",
//     "#22c55e",
//     "#10b981",
//     "#14b8a6",
//     "#06b6d4",
//     "#0ea5e9",
//     "#3b82f6",
//     "#6366f1",
//     "#8b5cf6",
//     "#a855f7",
//     "#d946ef",
//     "#ec4899",
//   ];

//   const handleColorSelect = (color: string) => {
//     onChange(color);
//     setIsOpen(false);
//     if (onBlur && color !== initialValueRef.current) onBlur();
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//     if (onBlur && value !== initialValueRef.current) onBlur();
//   };

//   return (
//     <div className="relative">
//       <button
//         type="button"
//         onClick={() => setIsOpen(!isOpen)}
//         className={`w-full flex items-center gap-2 px-3 py-2 text-sm border rounded-md transition-all ${
//           showError
//             ? "border-red-400 bg-red-50/50"
//             : "border-gray-200 hover:border-gray-300 bg-white"
//         }`}
//       >
//         <div
//           className="w-5 h-5 rounded border-2 border-gray-200 flex-shrink-0"
//           style={{ backgroundColor: value || "#3b82f6" }}
//         />
//         <span className="text-gray-700 flex-1 text-left text-xs font-mono">
//           {value || "Select color"}
//         </span>
//         <Paintbrush size={14} className="text-gray-400" />
//       </button>

//       {isOpen && (
//         <>
//           <div className="fixed inset-0 z-40" onClick={handleClose} />
//           <div className="absolute left-0 right-0 z-50 mt-1 p-3 bg-white rounded-lg shadow-xl border border-gray-200">
//             <div className="grid grid-cols-4 gap-2 mb-3">
//               {colorPresets.map((color) => (
//                 <button
//                   key={color}
//                   type="button"
//                   onClick={() => handleColorSelect(color)}
//                   className="relative w-full aspect-square rounded-md border-2 hover:scale-110 transition-transform"
//                   style={{
//                     backgroundColor: color,
//                     borderColor: value === color ? "#3b82f6" : "#e5e7eb",
//                   }}
//                 >
//                   {value === color && (
//                     <Check
//                       size={14}
//                       className="absolute inset-0 m-auto text-white drop-shadow"
//                       strokeWidth={3}
//                     />
//                   )}
//                 </button>
//               ))}
//             </div>
//             <Input
//               type="text"
//               value={value || ""}
//               onChange={(e: any) => onChange(e.target.value)}
//               placeholder="#000000"
//               className="w-full px-3 py-1.5 text-xs font-mono border border-gray-200 rounded-md"
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

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

    // Trigger onBlur when closing (if value changed)
    if (onBlur && value !== initialValueRef.current) {
      onBlur();
    }
  };

  // Close picker when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (popoverOpen) return;

  //     if (
  //       pickerRef.current &&
  //       !pickerRef.current.contains(event.target as Node)
  //     ) {
  //       handleClose();
  //     }
  //   };

  //   if (isOpen) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [isOpen]);

  // Update initial value when picker opens
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

    // Trigger onBlur when color is selected (if value changed)
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
        <>
          {/* <div className="fixed inset-0 z-10" onClick={handleClose} /> */}
          <DismissableLayer
            onPointerDownOutside={(event) => {
              const target = event.target as HTMLElement;

              // If click comes from Radix Popover → ignore it
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
                        className={
                          "w-8 h-8 rounded-sm border-2 cursor-pointer flex items-center justify-center text-xs"
                        }
                        style={{
                          backgroundColor: customColor || "#fff",
                        }}
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      className="p-0 w-fit"
                      align="start"
                      side="top"
                      // onMouseDown={(e) => e.stopPropagation()}
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
        </>
      )}
    </div>
  );
};
