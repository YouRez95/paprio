import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Archive,
  EllipsisVertical,
  FileText,
  Star,
  Trash,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownActions } from "./DropdownActions";

// Types
interface FileItem {
  id: string;
  name: string;
  createdAt: string;
  tags: string[];
  project: string;
  lastModified: string;
  status: "active" | "archived" | "trashed";
  isFavorite: boolean;
  folder: string;
}

type SortField = "name" | "createdAt" | "lastModified" | "project";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "active" | "archived" | "trashed";

// Mock data
const defaultFiles: FileItem[] = [
  {
    id: "file1",
    name: "My_Resume.pdf",
    createdAt: "2023-10-01",
    tags: ["Resume", "Job Search"],
    project: "Job Search",
    lastModified: "2 hours ago",
    status: "active",
    isFavorite: true,
    folder: "/Documents/CVs",
  },
  {
    id: "file2",
    name: "Project_Report.pdf",
    createdAt: "2023-09-15",
    tags: ["Report"],
    project: "Client X",
    lastModified: "5 days ago",
    status: "archived",
    isFavorite: false,
    folder: "/Projects/2023",
  },
  {
    id: "file3",
    name: "Old_Notes.pdf",
    createdAt: "2023-08-20",
    tags: ["Notes"],
    project: "Learning",
    lastModified: "3 weeks ago",
    status: "trashed",
    isFavorite: false,
    folder: "/Trash",
  },
  {
    id: "file4",
    name: "Frontend_Portfolio.pdf",
    createdAt: "2023-10-05",
    tags: ["Portfolio", "Web Dev"],
    project: "Personal Branding",
    lastModified: "30 minutes ago",
    status: "active",
    isFavorite: true,
    folder: "/Portfolios",
  },
  {
    id: "file5",
    name: "Q3_Financials.pdf",
    createdAt: "2023-09-28",
    tags: ["Finance", "Report"],
    project: "Company Reports",
    lastModified: "1 day ago",
    status: "active",
    isFavorite: false,
    folder: "/Work/Finance",
  },
  {
    id: "file6",
    name: "React_Course_Notes.pdf",
    createdAt: "2023-09-10",
    tags: ["Learning", "Programming"],
    project: "Skill Development",
    lastModified: "1 week ago",
    status: "archived",
    isFavorite: true,
    folder: "/Education",
  },
  {
    id: "file7",
    name: "Event_Proposal.pdf",
    createdAt: "2023-08-15",
    tags: ["Proposal", "Event"],
    project: "Marketing",
    lastModified: "2 months ago",
    status: "trashed",
    isFavorite: false,
    folder: "/Trash",
  },
  {
    id: "file8",
    name: "Team_Handbook.pdf",
    createdAt: "2023-10-12",
    tags: ["HR", "Documentation"],
    project: "Company Resources",
    lastModified: "Today",
    status: "active",
    isFavorite: true,
    folder: "/HR",
  },
  {
    id: "file9",
    name: "Old_Contract.pdf",
    createdAt: "2023-05-22",
    tags: ["Legal"],
    project: "Client Y",
    lastModified: "5 months ago",
    status: "archived",
    isFavorite: false,
    folder: "/Legal/2023",
  },
  {
    id: "file10",
    name: "UX_Wireframes.pdf",
    createdAt: "2023-10-08",
    tags: ["Design", "UI/UX"],
    project: "App Redesign",
    lastModified: "3 days ago",
    status: "active",
    isFavorite: false,
    folder: "/Design/Projects",
  },
];

export default function LastRecentFiles() {
  const isLoading = false;
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("lastModified");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Recent Files</h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <SelectTrigger className="w-full sm:w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Files</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="trashed">Trashed</SelectItem>
            </SelectContent>
          </Select>

          {/* Search Bar */}
          <div className="relative flex items-center w-full sm:w-[280px]">
            <SearchIcon className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search files, projects, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4"
              aria-label="Search files"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableCaption className="sr-only">
            A list of your recent files with their status and details.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">
                <button
                  onClick={() => toggleSort("name")}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                  aria-label="Sort by file name"
                >
                  File name
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead className="font-semibold">Tags</TableHead>
              <TableHead className="font-semibold">
                <button
                  onClick={() => toggleSort("project")}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                  aria-label="Sort by project"
                >
                  Project
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead className="font-semibold">
                <button
                  onClick={() => toggleSort("lastModified")}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                  aria-label="Sort by last modified"
                >
                  Last modified
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead className="text-center font-semibold">
                Status
              </TableHead>
              <TableHead className="w-[50px]">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  Loading files...
                </TableCell>
              </TableRow>
            ) : defaultFiles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  {searchQuery || statusFilter !== "all"
                    ? "No files found matching your criteria"
                    : "No files available"}
                </TableCell>
              </TableRow>
            ) : (
              defaultFiles.map((file) => (
                <TableRow
                  key={file.id}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <FileText
                          className="h-8 w-8 bg-primary/10 text-primary p-1.5 rounded-md"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium truncate">
                            {file.name}
                          </span>
                          {file.isFavorite && (
                            <Star
                              className="flex-shrink-0 h-4 w-4 text-yellow-500 fill-yellow-500"
                              aria-label="Favorite"
                            />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {file.createdAt}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {file.tags.slice(0, 2).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {file.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{file.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{file.project}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {file.lastModified}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={file.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu
                      open={activeDropdown === file.id}
                      onOpenChange={(open) =>
                        setActiveDropdown(open ? file.id : null)
                      }
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                          aria-label={`Actions for ${file.name}`}
                        >
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownActions fileId={file.id} fileName={file.name} />
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const StatusBadge = ({ status }: { status: FileItem["status"] }) => {
  const config = {
    active: {
      variant: "secondary" as const,
      icon: FileText,
      label: "Active",
    },
    archived: {
      variant: "default" as const,
      icon: Archive,
      label: "Archived",
    },
    trashed: {
      variant: "destructive" as const,
      icon: Trash,
      label: "Trashed",
    },
  };

  const { variant, icon: Icon, label } = config[status];

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{label}</span>
    </Badge>
  );
};

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
