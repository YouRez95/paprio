import { ArchiveIcon, FolderHeart, PanelTop, Trash2 } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";

export function NavProjects() {
  const projects = [
    {
      name: "Templates",
      url: "/dashboard/templates",
      icon: PanelTop,
    },
    {
      name: "Favorites",
      url: "/dashboard/favorites",
      icon: FolderHeart,
    },
    {
      name: "Archived",
      url: "/dashboard/archived",
      icon: ArchiveIcon,
    },
    {
      name: "Trash & Recovery",
      url: "/dashboard/trash",
      icon: Trash2,
    },
  ];

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link to={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
