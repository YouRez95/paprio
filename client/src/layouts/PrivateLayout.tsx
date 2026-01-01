import { AppSidebar } from "@/components/navbar/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { QueryProvider } from "@/providers/QueryProvider";
import { Outlet } from "react-router";

// import BreadCrumb from "@/components/bread-crumb";
// import { registerLicense } from "@syncfusion/ej2-base";

// registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE_KEY);

export default function PrivateLayout() {
  return (
    <QueryProvider>
      <SidebarProvider>
        <AppSidebar className="" />
        <SidebarInset className="overflow-x-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              {/* <BreadCrumb /> */}
              BreadCrumb here
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </QueryProvider>
  );
}
