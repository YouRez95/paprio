import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";
import { createElement } from "react";

// Type-safe error structure
interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
  message?: string;
}

// Toast configuration with semantic meanings
const TOAST_CONFIG = {
  success: {
    icon: CheckCircle2,
    className: "toast-success",
  },
  error: {
    icon: XCircle,
    className: "toast-error",
  },
  warning: {
    icon: AlertCircle,
    className: "toast-warning",
  },
  info: {
    icon: Info,
    className: "toast-info",
  },
  loading: {
    icon: Loader2,
    className: "toast-loading",
  },
} as const;

// Enhanced error toast with better UX
type ShowErrorToastParams = {
  error: ApiError;
  fallbackMessage?: string;
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
};
export function showErrorToast({
  error,
  fallbackMessage,
  position,
}: ShowErrorToastParams) {
  const status = error?.response?.status;
  const backendMessage = error?.response?.data?.message;
  const genericMessage = error?.message;

  // Build user-friendly message based on status
  let title = "Error";
  let message =
    backendMessage ||
    genericMessage ||
    fallbackMessage ||
    "Something went wrong";
  let action: { label: string; onClick: () => void } | undefined;

  // Context-aware error handling
  switch (status) {
    case 400:
      title = "Invalid Request";
      message = backendMessage || "Please check your input and try again";
      break;
    case 401:
      title = "Authentication Required";
      message = "Please log in to continue";
      action = {
        label: "Log In",
        onClick: () => (window.location.href = "/login"),
      };
      break;
    case 403:
      title = "Access Denied";
      message =
        backendMessage || "You don't have permission to perform this action";
      break;
    case 404:
      title = "Not Found";
      message = backendMessage || "The requested resource could not be found";
      break;
    case 409:
      title = "Conflict";
      message = backendMessage || "This action conflicts with existing data";
      break;
    case 422:
      title = "Validation Error";
      const errors = error?.response?.data?.errors;
      if (errors) {
        const errorMessages = Object.values(errors).flat();
        message = errorMessages.join(", ");
      }
      break;
    case 429:
      title = "Too Many Requests";
      message = "Please slow down and try again in a moment";
      break;
    case 500:
    case 502:
    case 503:
      title = "Server Error";
      message = "Something went wrong on our end. We're working on it";
      action = {
        label: "Retry",
        onClick: () => window.location.reload(),
      };
      break;
    case 504:
      title = "Request Timeout";
      message = "The request took too long. Please try again";
      break;
  }

  // ✅ NOW USING TOAST_CONFIG
  const ErrorIcon = TOAST_CONFIG.error.icon;

  toast.error(title, {
    description: message,
    duration: status && status >= 500 ? 5000 : 4000,
    action: action,
    className: TOAST_CONFIG.error.className,
    icon: createElement(ErrorIcon, { className: "w-5 h-5" }),
    position: position ? position : "bottom-right",
  });
}

type ShowSuccessToastParams = {
  message: string;
  description?: string;
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
};
// Success toast with consistent design
export function showSuccessToast({
  message,
  description,
  position,
}: ShowSuccessToastParams) {
  const SuccessIcon = TOAST_CONFIG.success.icon;

  toast.success(message, {
    description,
    duration: 3000,
    className: TOAST_CONFIG.success.className,
    icon: createElement(SuccessIcon, { className: "w-5 h-5" }),
    position: position ? position : "bottom-right",
  });
}

// Warning toast for non-critical issues
export function showWarningToast(message: string, description?: string) {
  // ✅ NOW USING TOAST_CONFIG
  const WarningIcon = TOAST_CONFIG.warning.icon;

  toast.warning(message, {
    description,
    duration: 4000,
    className: TOAST_CONFIG.warning.className, // ✅ Using className from config
    icon: createElement(WarningIcon, { className: "w-5 h-5" }), // ✅ Using icon from config
  });
}

// Info toast for neutral information
export function showInfoToast(message: string, description?: string) {
  // ✅ NOW USING TOAST_CONFIG
  const InfoIcon = TOAST_CONFIG.info.icon;

  toast.info(message, {
    description,
    duration: 3000,
    className: TOAST_CONFIG.info.className, // ✅ Using className from config
    icon: createElement(InfoIcon, { className: "w-5 h-5" }), // ✅ Using icon from config
  });
}

// Loading toast for async operations
export function showLoadingToast(message: string) {
  // ✅ NOW USING TOAST_CONFIG
  const LoadingIcon = TOAST_CONFIG.loading.icon;

  return toast.loading(message, {
    className: TOAST_CONFIG.loading.className, // ✅ Using className from config
    icon: createElement(LoadingIcon, { className: "w-5 h-5 animate-spin" }), // ✅ Using icon from config with spin
  });
}

// Promise toast for automatic state handling
export function showPromiseToast<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }
) {
  // ✅ NOW USING TOAST_CONFIG FOR ALL STATES
  const LoadingIcon = TOAST_CONFIG.loading.icon;

  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
    // Icons for each state
    icon: createElement(LoadingIcon, { className: "w-5 h-5 animate-spin" }),
    // Note: Sonner doesn't have successIcon/errorIcon props by default
    // The success/error will use default icons, but we apply className
    className: TOAST_CONFIG.loading.className,
  });
}
