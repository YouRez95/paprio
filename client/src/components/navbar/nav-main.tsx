import { ChevronRight, Folder, Home, LayoutGrid, Plus } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, type ReactNode } from "react";
import { NewEntityDialog } from "../dashboard/NewEntityDialog";
// import { NewTeam } from "./dialogs/NewTeam";
// import { NewBeamer } from "./dialogs/NewBeamer";
// import { NewEntityDialog } from "./dialogs/NewEntityDialog";

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "All Projects",
    url: "/dashboard/projects",
    icon: LayoutGrid,
  },
  {
    title: "Project Files",
    url: "",
    icon: Folder,
    isActive: true,
    items: [
      {
        title: "New Folder",
      },
      {
        title: "New Document",
      },
      {
        title: "New Team",
      },
      {
        title: "New Beamer",
      },
    ],
  },
];

type activeDialogType =
  | "New Folder"
  | "New Document"
  | "New Team"
  | "New Beamer";

export function NavMain() {
  const [activeDialog, setActiveDialog] = useState<activeDialogType | null>(
    null
  );

  const closeDialog = () => setActiveDialog(null);

  const dialogComponents: Record<activeDialogType, ReactNode> = {
    "New Folder": <NewEntityDialog onClose={closeDialog} typeDialog="Folder" />,
    "New Document": <>New Document</>,
    "New Team": <>New Team</>, // <NewTeam />
    "New Beamer": <>New Beamer</>,
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          {navMain.map((item) => (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              <SidebarMenuItem>
                {item.items?.length ? (
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <div className="cursor-pointer">
                        <item.icon />
                        <span className="">{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                ) : (
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span className="">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="border-none">
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title} className="">
                            <SidebarMenuSubButton
                              asChild
                              className="group cursor-pointer h-8 rounded-md"
                              onClick={() =>
                                setActiveDialog(
                                  subItem.title as activeDialogType
                                )
                              }
                            >
                              <div className="flex items-center gap-2">
                                <Plus className="mr-2 size-4" />
                                <span className="">{subItem.title}</span>
                              </div>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      {/* 🪟 Dialog */}
      <Dialog
        open={!!activeDialog}
        onOpenChange={(open) => !open && setActiveDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{activeDialog}</DialogTitle>
          </DialogHeader>
          {activeDialog && dialogComponents[activeDialog]}
        </DialogContent>
      </Dialog>
    </>
  );
}
