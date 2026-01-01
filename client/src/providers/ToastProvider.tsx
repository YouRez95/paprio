import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={true}
      richColors={false}
      closeButton={true}
      duration={4000}
      toastOptions={{
        className: "toast-base",
        style: {
          fontSize: "14px",
          lineHeight: "1.5",
        },
      }}
      //-Custom gap between toasts
      gap={8}
      //Custom offset from edges
      offset={16}
    />
  );
}
