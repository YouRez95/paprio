import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Download, Eye, FilePen, Share2, Trash } from "lucide-react";

interface DropdownActionsProps {
  fileId: string;
  fileName: string;
}

export const DropdownActions = ({ fileId, fileName }: DropdownActionsProps) => {
  const handleAction = (action: string) => {
    console.log(`Action: ${action}, File Id: ${fileId}`);
  };

  return (
    <DropdownMenuContent align="end" className="min-w-48">
      <DropdownMenuLabel className="font-normal text-sm text-muted-foreground truncate">
        {fileName}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="cursor-pointer"
        onClick={() => handleAction("preview")}
      >
        <Eye className="mr-2 h-4 w-4" />
        <span>Preview</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        className="cursor-pointer"
        onClick={() => handleAction("download")}
      >
        <Download className="mr-2 h-4 w-4" />
        <span>Download</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        className="cursor-pointer"
        onClick={() => handleAction("share")}
      >
        <Share2 className="mr-2 h-4 w-4" />
        <span>Share</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        className="cursor-pointer"
        onClick={() => handleAction("rename")}
      >
        <FilePen className="mr-2 h-4 w-4" />
        <span>Rename</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="cursor-pointer text-destructive focus:text-destructive"
        onClick={() => handleAction("delete")}
      >
        <Trash className="mr-2 h-4 w-4" />
        <span>Delete</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};
