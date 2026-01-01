import { QueryProvider } from "@/providers/QueryProvider";
import FileEditor from "@/components/BuilderPage/FileEditor";

export default function BuilderPage() {
  return (
    <QueryProvider>
      <div>
        <div className="h-screen overflow-hidden max-h-screen">
          <FileEditor />
        </div>
      </div>
    </QueryProvider>
  );
}
