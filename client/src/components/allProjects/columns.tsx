import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Download,
  Eye,
  FilePen,
  FolderRoot,
  MoreHorizontal,
  Share2,
  Star,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router";
import type { Member, Owner, Project } from "@/types/project.types";
import type { Tag } from "@/types/tag.types";

export const columns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Project Name",
    cell: ({ row }) => {
      const projectName = row.getValue("name") as string;
      const isFavorite = row.original.userSettings[0]?.isFavorite ?? false;
      const createdAt = row.original.createdAt;
      // Format createdAt to a readable date string
      const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      // const slug = `${slugify(projectName)}--${row.original.id}`;
      // const slug = `${slugify(projectName)}~${btoa(row.original.id)}`;
      const slug = row.original.id;
      return (
        <Link
          className="flex items-center gap-1"
          to={`/dashboard/projects/${slug}`}
        >
          <FolderRoot className="inline mr-2 h-7 w-7 bg-accent-foreground/10 text-primary p-1.5 rounded-sm" />
          <div className="flex flex-col gap-1">
            <span className="font-medium flex items-center">
              {projectName}
              {isFavorite && (
                <Star className="inline ml-1 h-4 w-4 text-yellow-500 fill-yellow-500" />
              )}
            </span>
            <span className="text-sm text-muted-foreground">
              {formattedDate}
            </span>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      const ownerId = row.original.ownerId;
      const owner = row.getValue("owner") as Owner;
      if (ownerId !== owner.id) {
        return (
          <Avatar
            key={owner.id}
            className="relative -mr-2 w-6 h-6 rounded-full overflow-hidden border-2 border-white"
          >
            <AvatarImage src={owner.imageUrl ? owner.imageUrl : undefined} />
            <AvatarFallback>{owner.email}</AvatarFallback>
          </Avatar>
        );
      }
      return <div>You</div>;
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.getValue("tags") as Tag[] | null;

      if (!tags || tags.length === 0) {
        return (
          <Badge variant="secondary" className="text-xs">
            Uncategorized
          </Badge>
        );
      }
      return (
        <div className="flex flex-wrap w-fit gap-x-2 gap-y-1 max-w-96">
          {tags.map((tag) => (
            <Badge key={tag.id} variant="outline" className="text-xs max-w-fit">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tag.color }}
              ></span>
              <span>{tag.text}</span>
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "members",
    header: "Members",
    cell: ({ row }) => {
      const members = row.getValue("members") as Member[];
      return (
        <div className="flex flex-1 justify-start">
          {members.map((user) => (
            <Avatar
              key={user.id}
              className="relative -mr-2 w-6 h-6 rounded-full overflow-hidden border-2 border-white"
            >
              <AvatarImage
                src={user.user.imageUrl ? user.user.imageUrl : undefined}
              />
              <AvatarFallback>{user.user.email}</AvatarFallback>
            </Avatar>
          ))}
          <div
            className={`relative bg-primary -mr-2 w-6 h-6 rounded-full overflow-hidden border-2 text-white border-white flex items-center justify-center`}
          >
            <span className="text-xs font-semibold">+</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Modified",
    cell: ({ row }) => {
      const lastModified = row.getValue("updatedAt") as string;
      const date = formatDistanceToNow(new Date(lastModified), {
        addSuffix: true,
      });
      return <span className="text-sm text-muted-foreground">{date}</span>;
    },
  },

  {
    id: "actions",
    cell: ({}) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="">
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer text-muted-foreground">
              <Eye className="mr-1 h-4 w-4 hover:text-primary" />
              <span>Preview</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-muted-foreground">
              <Download className="mr-1 h-4 w-4 hover:text-primary" />
              <span>Download</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-muted-foreground">
              <Share2 className="mr-1 h-4 w-4 hover:text-primary" />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-muted-foreground">
              <FilePen className="mr-1 h-4 w-4 hover:text-primary" />
              <span className="">Rename</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="text-destructive cursor-pointer group hover:font-medium"
            >
              <Trash className="mr-1 h-4 w-4 text-destructive group-hover:stroke-2" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
