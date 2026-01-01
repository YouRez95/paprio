import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Book,
  File,
  Files,
  LayoutTemplate,
  Shapes,
  TableOfContents,
} from "lucide-react";
import { useCallback, useState } from "react";
import FileEditorBlocks from "./BlocksDefinitionTab/FileEditorBlocks";
import FileEditorDocumentBlocks from "./DocumentBlockTab/FileEditorDocumentBlocks";
import FileEditorDocumentVersions from "./VersionsTab/FileEditorDocumentVersions";

export default function FileEditorSidebar() {
  const [activeTab, setActiveTab] = useState("document");

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  return (
    <Tabs
      className="flex flex-row h-full gap-0"
      value={activeTab}
      onValueChange={handleTabChange}
    >
      <TabsList className="h-full border-r rounded-none flex items-start py-5 bg-background">
        <div className="flex flex-col gap-5">
          <TabsTrigger
            value="document"
            className="data-[state=active]:shadow-none rounded-none flex flex-col data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground/80"
          >
            <File size={20} />
            <span className="text-[10px] font-medium">Document</span>
          </TabsTrigger>

          <TabsTrigger
            value="blocks"
            className="data-[state=active]:shadow-none rounded-none flex flex-col data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground/80"
          >
            <TableOfContents size={20} />
            <span className="text-[10px] font-medium">Blocks</span>
          </TabsTrigger>

          <TabsTrigger
            value="templates"
            className="data-[state=active]:shadow-none rounded-none flex flex-col data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground/80"
          >
            <Book size={20} />
            <span className="text-[10px] font-medium">Templates</span>
          </TabsTrigger>

          <TabsTrigger
            value="layouts"
            className="data-[state=active]:shadow-none rounded-none flex flex-col data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground/80"
          >
            <LayoutTemplate size={20} />
            <span className="text-[10px] font-medium">Layouts</span>
          </TabsTrigger>

          <TabsTrigger
            value="shapes"
            className="data-[state=active]:shadow-none rounded-none flex flex-col data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground/80"
          >
            <Shapes size={20} />
            <span className="text-[10px] font-medium">Shapes</span>
          </TabsTrigger>

          <TabsTrigger
            value="versions"
            className="data-[state=active]:shadow-none rounded-none flex flex-col data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground/80"
          >
            <Files size={20} />
            <span className="text-[10px] font-medium">Versions</span>
          </TabsTrigger>
        </div>
      </TabsList>

      <TabsContent
        value="document"
        className="border-r h-full rounded-none m-0 w-[300px] overflow-x-hidden"
      >
        <FileEditorDocumentBlocks />
      </TabsContent>

      <TabsContent
        value="blocks"
        className="border-r h-full rounded-none m-0 w-[300px]"
      >
        <FileEditorBlocks setActiveTab={handleTabChange} />
      </TabsContent>

      <TabsContent
        value="templates"
        className="border-r h-full rounded-none m-0 w-[300px]"
      >
        Templates Here...
      </TabsContent>

      <TabsContent
        value="layouts"
        className="border-r h-full rounded-none m-0 w-[300px]"
      >
        Layouts Here...
      </TabsContent>

      <TabsContent
        value="shapes"
        className="border-r h-full rounded-none m-0 w-[300px]"
      >
        Shapes Here...
      </TabsContent>
      <TabsContent
        value="versions"
        className="border-r h-full rounded-none m-0 w-[300px]"
      >
        <FileEditorDocumentVersions />
      </TabsContent>
    </Tabs>
  );
}
