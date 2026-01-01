import CreateProjectDialog from "@/components/dashboard/CreateProjectDialog";
import LastRecentFiles from "@/components/dashboard/LastRecentFiles";
import ProjectsScrollable from "@/components/dashboard/ProjectScrollable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Dashboard() {
  return (
    <section className="mt-10 flex flex-col gap-20">
      <div className="flex flex-col lg:flex-row justify-between gap-16 items-start lg:items-center px-5 lg:h-[300px]">
        {/* Manage Your Projects */}
        <div className="flex flex-col gap-6 lg:w-1/3">
          <h1
            className={`text-7xl md:text-6xl xl:text-7xl bg-gradient-to-b font-bold tracking-tight`}
          >
            Manage Your <br /> Projects
          </h1>
          <p className="text-muted-foreground max-w-[300px]">
            Create Project to sort files and have quick access to documents
          </p>
        </div>

        <div className="h-[200px] lg:h-full flex w-full lg:w-2/3 gap-4 overflow-hidden">
          <div
            className="border-muted-foreground w-[150px] h-full border-[1px] border-dashed 
           rounded-xl flex items-center justify-center text-6xl text-muted-foreground"
          >
            <CreateProjectDialog>
              <Button
                variant={"ghost"}
                className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-accent rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Create new project"
              >
                <Plus className="w-10 h-10" aria-hidden="true" />
                <span className="text-sm absolute top-1/2 mt-5">
                  Create Project
                </span>
              </Button>
            </CreateProjectDialog>
          </div>

          {/* Scrollable Content Section */}
          <div className="w-full overflow-hidden">
            <ProjectsScrollable />
          </div>
        </div>
      </div>
      <div className="mb-10 px-5 border-t border-muted-foreground/10 pt-5">
        <LastRecentFiles />
      </div>
    </section>
  );
}
