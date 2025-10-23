import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@radix-ui/react-separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Plus } from "lucide-react";
import { COLORS } from "@/constants/colors";
import { isColorLight } from "@/lib/utils";
import { useCreateTag, useGetTags } from "@/hooks/useTags";
// import { useProjects } from "@/hooks/useProjects";

type CreateTagDialogProps = {
  open: boolean;
  onOpen: (open: boolean) => void;
  projectIds?: string[];
};

export default function CreateTagDialog({
  open,
  onOpen,
  projectIds,
}: CreateTagDialogProps) {
  // const { useCreateTags, useGetTags } = useProjects();
  const { mutate: createTagsMutation, isPending } = useCreateTag();
  const { data: tags } = useGetTags();
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [customColor, setCustomColor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");

  const handleColorSelect = (color: string) => {
    setError(null);
    setSelectedColor(color);
    setCustomColor(null);
  };

  const handleCustomColor = (color: string) => {
    setError(null);
    setCustomColor(color);
    setSelectedColor(color);
  };

  const handleCreateTags = () => {
    // Validate data
    if (!name.trim()) {
      setError("Please enter a name for the tag.");
      return;
    }

    if (!selectedColor && !customColor) {
      setError("Please select a color for the tag.");
      return;
    }
    const tagAlreadyExist = tags?.find((tag) => tag.text === name.trim());

    if (tagAlreadyExist) {
      setError("Tag with this name already exists.");
      return;
    }

    console.log("tag data", {
      color: customColor || selectedColor,
      tagName: name,
      projectIds: projectIds || [],
    });

    setError(null);
    createTagsMutation(
      {
        color: customColor || selectedColor,
        tagName: name,
        projectIds: projectIds || [],
      },
      {
        onSuccess: () => {
          onOpen(false);
          setName("");
          setSelectedColor("");
          setCustomColor(null);
          setError(null);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogContent className="p-0 py-2">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>Create New Tag</DialogTitle>
        </DialogHeader>
        <Separator className="h-[1px] bg-primary/20" />
        <div className="grid gap-4 px-5">
          <div className="grid gap-3">
            <Label htmlFor="tag">New tag name</Label>
            <Input
              id="tag"
              name="tag"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tag name"
            />
          </div>
          <div className="grid gap-3">
            <Label>Tag color</Label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLORS.map((color) => (
                <div
                  key={color}
                  className={
                    "w-8 h-8 rounded-sm border-2 flex items-center justify-center cursor-pointer"
                  }
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                >
                  {selectedColor === color && (
                    <Check className={`text-white w-4 h-4`} />
                  )}
                </div>
              ))}

              {/* Custom color picker trigger */}
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <div
                    className={
                      "w-8 h-8 rounded-sm border-2 cursor-pointer flex items-center justify-center text-xs"
                    }
                    style={{
                      backgroundColor: customColor || "#fff",
                    }}
                  >
                    {customColor && (
                      <Check
                        className={`w-4 h-4 ${
                          isColorLight(customColor)
                            ? "text-black"
                            : "text-white"
                        }`}
                      />
                    )}
                    {!customColor && <Plus className="text-gray-500 w-4 h-4" />}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-fit" align="start">
                  <HexColorPicker
                    color={customColor || "#ffffff"}
                    onChange={handleCustomColor}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <Separator className="h-[1px] bg-primary/20" />
        {error && (
          <div className="px-5 py-2 text-red-600">
            <span>{error}</span>
          </div>
        )}
        <DialogFooter className="px-5">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={isPending} onClick={handleCreateTags}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
