import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Archive,
  Check,
  ChevronDown,
  Download,
  FolderHeart,
  Plus,
  Tag as TagIcon,
  Trash,
} from "lucide-react";
import type { Project } from "@/types/project.types";
// import type { AllProject, Tags } from "@/types/api";
// import CreateTagDialog from "@/components/dialogs/CreateTagDialog";
// import { useProjects } from "@/hooks/useProjects";
import { getCommonTagsFromSelectedRows } from "@/lib/utils";
import type { Tag } from "@/types/tag.types";
import { useGetTags, useToggleTag } from "@/hooks/useTags";
import CreateTagDialog from "../navbar/create-tag-dialog";
import CreateProjectDialog from "../dashboard/CreateProjectDialog";

type TagAction = "add" | "remove";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  setSearchTerm: (term: string) => void;
  searchTerm?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onPageChange,
  page,
  pageCount,
  setSearchTerm,
  searchTerm,
}: DataTableProps<TData, TValue>) {
  // const { useGetTags, useToggleTags } = useProjects();
  const { data: tags } = useGetTags();
  const { mutate: toggleTagMutation, isPending } = useToggleTag();
  const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    getRowId: (row) => (row as Project).id,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater(table.getState().pagination)
          : updater;
      onPageChange(next.pageIndex + 1);
    },
    state: {
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize: data.length,
      },
    },
  });

  const commonTags = getCommonTagsFromSelectedRows<TData>(table);

  const handleToggleTags = (tag: Tag) => {
    const checked = commonTags.some((t) => t.text === tag.text);
    const type: TagAction = checked ? "remove" : "add";
    const projectIds = Object.keys(rowSelection);

    toggleTagMutation({
      projectIds,
      tagId: tag.id,
      type,
    });
  };

  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="project name ..."
          value={searchTerm || ""}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            onPageChange(1);
          }}
          className="max-w-sm"
        />
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <div className="flex items-center gap-5">
            {/* Actions for multiple projects */}
            <div className="flex">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="rounded-r-none" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="rounded-none border-x-0 border-r"
                    variant={"outline"}
                  >
                    <FolderHeart />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Favorites</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="rounded-none border-x-0"
                    variant={"outline"}
                  >
                    <Archive />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Archive</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="rounded-l-none hover:bg-destructive/10"
                    variant="outline"
                  >
                    <Trash />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Trash</p>
                </TooltipContent>
              </Tooltip>
            </div>
            {/* Tags actions dropdown */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} className="">
                    <TagIcon />
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-52">
                  <DropdownMenuLabel>Add to tag</DropdownMenuLabel>
                  {tags &&
                    tags.map((tag) => (
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        key={tag.text}
                        className="text-sm"
                        onClick={() => handleToggleTags(tag)}
                        disabled={isPending}
                      >
                        <span>
                          {commonTags.find((t) => t.text === tag.text) ? (
                            <Check className="mr-2 h-4 w-4 text-primary" />
                          ) : (
                            <span className="mr-2 w-4 h-4 block"></span>
                          )}
                        </span>
                        <span
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        ></span>
                        <span className="">{tag.text}</span>
                      </DropdownMenuItem>
                    ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setOpenCreateTagDialog(true)}
                  >
                    Create new tag
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CreateTagDialog
              open={openCreateTagDialog}
              onOpen={setOpenCreateTagDialog}
              projectIds={Object.keys(rowSelection)}
            />
          </div>
        ) : (
          <div>
            <CreateProjectDialog>
              <Button className="flex items-center cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </CreateProjectDialog>
          </div>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-foreground/50"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
