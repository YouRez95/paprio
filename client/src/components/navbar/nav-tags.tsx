import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreateTagDialog from "./create-tag-dialog";
import { useGetTags } from "@/hooks/useTags";
import { Link } from "react-router";
import TagsSkeleton from "@/components/skeletons/TagsSkeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function NavTags() {
  const [openAddTag, setOpenAddTag] = useState(false);
  const { data: tags, isPending, isError, error, refetch } = useGetTags();

  if (isPending) {
    return <TagsSkeleton />;
  }

  if (isError) {
    return (
      <SidebarGroup>
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error?.message || "Failed to load tags"}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetch()}
              className="ml-2"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </SidebarGroup>
    );
  }

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Organize Tags</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                variant={"ghost"}
                className="flex border cursor-pointer items-center gap-2 w-full justify-start"
                onClick={() => setOpenAddTag(true)}
              >
                <Plus className="w-4 h-4" />
                <span>New Tag</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {tags.length === 0 ? (
            <div className="px-2 py-4 text-sm text-muted-foreground">
              No tags yet. Create one to get started.
            </div>
          ) : (
            tags.map((tag) => (
              <SidebarMenuItem key={tag.id}>
                <SidebarMenuButton asChild>
                  <Link
                    to={`/dashboard/projects?tag=${encodeURIComponent(
                      tag.text
                    )}`}
                    className="flex items-center gap-2"
                  >
                    <Tag
                      className="w-4 h-4"
                      style={{ fill: tag.color, stroke: tag.color }}
                      aria-hidden="true"
                    />
                    <span className="truncate">{tag.text}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarGroup>
      <CreateTagDialog open={openAddTag} onOpen={setOpenAddTag} />
    </>
  );
}
