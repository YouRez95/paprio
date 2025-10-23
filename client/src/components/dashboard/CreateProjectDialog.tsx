import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useRef, useEffect } from "react";
import { useCreateProject } from "@/hooks/useProjects";

type CreateProjectDialogProps = {
  children: React.ReactNode;
};

export default function CreateProjectDialog({
  children,
}: CreateProjectDialogProps) {
  const { mutate: createProjectMutation, isPending } = useCreateProject();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {}
  );
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus name input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => nameInputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; description?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Project name is required";
    } else if (name.trim().length < 3) {
      newErrors.name = "Project name must be at least 3 characters";
    } else if (name.trim().length > 50) {
      newErrors.name = "Project name must be less than 50 characters";
    }

    if (description.trim().length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log("project info", name, description);
    createProjectMutation(
      { projectName: name.trim(), projectDescription: description.trim() },
      {
        onSuccess: () => {
          handleCancel();
        },
      }
    );
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const isFormValid = name.trim().length >= 3 && name.trim().length <= 50;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="relative">
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new project</DialogTitle>
            <DialogDescription>
              Projects help you organize and quickly access related documents.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-6">
            {/* Project Name Input */}
            <div className="space-y-2">
              <Label htmlFor="project-name" className="text-sm font-medium">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                ref={nameInputRef}
                id="project-name"
                placeholder="e.g., Marketing Campaign 2024"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={errors.name ? "border-destructive" : ""}
                maxLength={50}
                disabled={isPending}
              />
              {errors.name && (
                <p
                  id="name-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {errors.name}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {name.length}/50 characters
              </p>
            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <Label
                htmlFor="project-description"
                className="text-sm font-medium"
              >
                Description{" "}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="project-description"
                placeholder="Add a brief description of your project..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) {
                    setErrors((prev) => ({ ...prev, description: undefined }));
                  }
                }}
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
                className={`min-h-[100px] resize-none ${
                  errors.description ? "border-destructive" : ""
                }`}
                maxLength={500}
                disabled={isPending}
              />
              {errors.description && (
                <p
                  id="description-error"
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {errors.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {description.length}/500 characters
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending || !isFormValid}
              className="cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
