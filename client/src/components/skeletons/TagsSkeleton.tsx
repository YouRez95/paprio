import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function TagsSkeleton() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Organize Tags</SidebarGroupLabel>
      <SidebarMenu>
        {/* New Tag Button Skeleton */}
        <SidebarMenuItem>
          <Skeleton className="h-9 w-full" />
        </SidebarMenuItem>

        {/* Tag Items Skeleton - Show 3-5 placeholder tags */}
        {Array.from({ length: 4 }).map((_, index) => (
          <SidebarMenuItem key={index}>
            <div className="flex items-center gap-2 px-2 py-1.5 w-full">
              {/* Tag Icon Skeleton */}
              <Skeleton className="h-4 w-4 rounded-sm flex-shrink-0" />
              {/* Tag Text Skeleton - varying widths for realism */}
              <Skeleton
                className="h-4 rounded-sm"
                style={{
                  width: `${60 + Math.random() * 40}%`,
                }}
              />
            </div>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
