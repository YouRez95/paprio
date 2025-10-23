import * as React from "react";

import { NavMain } from "@/components/navbar/nav-main";
import { NavProjects } from "@/components/navbar/nav-projects";
import { NavSecondary } from "@/components/navbar/nav-secondary";
import { NavUser } from "@/components/navbar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router";
import { Separator } from "@/components/ui/separator";
import { Paperclip } from "lucide-react";
import NavTags from "./nav-tags";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/" className="relative">
                <div className="bg-primary text-background rounded-lg">
                  <Paperclip className="h-8 w-8 p-1" />
                </div>
                <h1 className="font-bold text-xl">Paprio</h1>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <Separator />
        <NavTags />
        <Separator />
        <NavProjects />
        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
