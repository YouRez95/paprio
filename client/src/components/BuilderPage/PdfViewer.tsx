import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PDFViewerProps = {
  pdfData: { url: string; compiled: boolean } | null;
  isPending?: boolean;
  isError?: boolean;
  errorMessage?: string;
};

const SCALE_PRESETS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function PDFViewer({
  pdfData,
  isPending = false,
  isError = false,
  errorMessage = "Failed to load PDF",
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const BASE_PDF_WIDTH = 794; // A4 width in px at 72dpi (react-pdf default)

  const baseScale = containerWidth ? containerWidth / BASE_PDF_WIDTH : 1;

  const effectiveScale = baseScale * scale;

  useEffect(() => {
    setPageNumber(1);
    setIsLoading(true);
    setLoadError(null);
  }, [pdfData]);

  const getPDFSource = () => {
    if (!pdfData) return null;
    return pdfData.compiled
      ? pdfData.url
      : import.meta.env.VITE_API_URL + pdfData.url;
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    setIsLoading(false);
    setLoadError(error.message || "Failed to load PDF document");
  }

  // Keyboard navigation (ignore inputs)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName))
        return;

      if (e.key === "ArrowLeft" && pageNumber > 1) {
        setPageNumber((p) => p - 1);
      }
      if (e.key === "ArrowRight" && pageNumber < numPages) {
        setPageNumber((p) => p + 1);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pageNumber, numPages]);

  return (
    <div className="flex h-full flex-col bg-muted/30">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">PDF Preview</span>
            {numPages > 0 && (
              <span className="text-xs text-muted-foreground">
                {pageNumber} / {numPages}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom */}
            <Select
              value={String(scale)}
              onValueChange={(v) => setScale(Number(v))}
            >
              <SelectTrigger className="h-8 w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCALE_PRESETS.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {Math.round(s * 100)}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-5" />

            {/* Navigation */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
              disabled={pageNumber >= numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div
          ref={containerRef}
          className="relative w-full overflow-x-auto overflow-y-auto py-6"
        >
          {/* Loading Overlay */}
          {(isPending || isLoading) && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <Skeleton className="h-6 w-40" />
                <span className="text-xs text-muted-foreground">
                  {isPending ? "Compiling PDF…" : "Loading PDF…"}
                </span>
              </div>
            </div>
          )}

          {/* Error */}
          {(isError || loadError) && (
            <div className="rounded-md border bg-background px-6 py-4 text-sm text-destructive shadow">
              {loadError || errorMessage}
            </div>
          )}

          {/* PDF */}
          {!isPending && !isError && pdfData && (
            <div className="mx-auto w-fit px-4">
              <Document
                file={getPDFSource()}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
              >
                <Page
                  pageNumber={pageNumber}
                  scale={effectiveScale}
                  className="bg-white shadow-xl rounded-md"
                />
              </Document>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// <div className="flex flex-col h-full overflow-hidden bg-gray-50">
//   {/* Toolbar */}
//   <div className="h-14 flex-shrink-0 bg-white px-4 py-2 border-b border-gray-200 shadow-sm">
//     <div className="flex items-center justify-between h-full">
//       <div className="flex items-center gap-3">
//         <h3 className="text-sm font-semibold text-gray-800">PDF Viewer</h3>
//         {numPages > 0 && (
//           <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//             {numPages} {numPages === 1 ? "page" : "pages"}
//           </span>
//         )}
//       </div>

//       {/* Zoom Controls */}
//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => setScale((prev) => Math.max(prev - 0.1, 0.3))}
//           disabled={isPending || isError || scale <= 0.3}
//           className="p-1.5 text-gray-700 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//           title="Zoom out"
//         >
//           <svg
//             className="w-4 h-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M20 12H4"
//             />
//           </svg>
//         </button>

//         <select
//           value={scale}
//           onChange={(e) => setScalePreset(Number(e.target.value))}
//           disabled={isPending || isError}
//           className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
//         >
//           {scalePresets.map((preset) => (
//             <option key={preset} value={preset}>
//               {Math.round(preset * 100)}%
//             </option>
//           ))}
//           {currentScaleIndex === -1 && (
//             <option value={scale}>{Math.round(scale * 100)}%</option>
//           )}
//         </select>

//         <button
//           onClick={() => setScale((prev) => Math.min(prev + 0.1, 3.0))}
//           disabled={isPending || isError || scale >= 3.0}
//           className="p-1.5 text-gray-700 hover:bg-gray-100 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//           title="Zoom in"
//         >
//           <svg
//             className="w-4 h-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 4v16m8-8H4"
//             />
//           </svg>
//         </button>
//       </div>
//     </div>
//   </div>

//   {/* PDF Content Area */}
//   <div className="flex-1 overflow-auto bg-gray-100 relative">
//     {/* Loading State */}
//     {(isPending || isLoading) && (
//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
//         <p className="text-sm text-gray-600 font-medium">
//           {isPending ? "Compiling PDF..." : "Loading PDF..."}
//         </p>
//       </div>
//     )}

//     {/* Error State */}
//     {(isError || loadError) && !isPending && (
//       <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
//           <svg
//             className="w-12 h-12 text-red-500 mx-auto mb-3"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//           <h3 className="text-lg font-semibold text-red-900 mb-2">
//             Error Loading PDF
//           </h3>
//           <p className="text-sm text-red-700">
//             {loadError || errorMessage}
//           </p>
//         </div>
//       </div>
//     )}

//     {/* No PDF State */}
//     {!isPending && !isError && !pdfData?.url && (
//       <div className="absolute inset-0 flex flex-col items-center justify-center">
//         <svg
//           className="w-16 h-16 text-gray-400 mb-4"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//           />
//         </svg>
//         <p className="text-sm text-gray-500 font-medium">
//           No PDF to display
//         </p>
//       </div>
//     )}

//     {/* PDF Document */}
//     {!isPending && !isError && pdfData && (
//       <div className="min-h-full flex justify-center items-start p-4">
//         <Document
//           // file={import.meta.env.VITE_API_URL + pdfURL}
//           file={getPDFSource()}
//           onLoadSuccess={onDocumentLoadSuccess}
//           onLoadError={onDocumentLoadError}
//           loading={
//             <div className="flex flex-col items-center justify-center py-12">
//               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
//               <p className="text-xs text-gray-500">Rendering document...</p>
//             </div>
//           }
//           error={
//             <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-sm">
//               <p className="text-sm text-red-700">Failed to render PDF</p>
//             </div>
//           }
//           className="shadow-lg"
//         >
//           <Page
//             pageNumber={pageNumber}
//             scale={scale}
//             renderTextLayer={true}
//             renderAnnotationLayer={true}
//             className="bg-white shadow-xl"
//             loading={
//               <div className="flex items-center justify-center p-8 bg-white shadow-xl">
//                 <div className="animate-pulse text-gray-400">
//                   Loading page...
//                 </div>
//               </div>
//             }
//           />
//         </Document>
//       </div>
//     )}
//   </div>

//   {/* Footer with Navigation */}
//   <div className="h-14 flex-shrink-0 bg-white px-4 py-2 border-t border-gray-200 shadow-sm">
//     <div className="flex items-center justify-between h-full">
//       <div className="flex items-center gap-2">
//         <span className="text-xs text-gray-600 font-medium">
//           Page {numPages > 0 ? pageNumber : "—"} of{" "}
//           {numPages > 0 ? numPages : "—"}
//         </span>
//       </div>

//       {/* Navigation Buttons */}
//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => setPageNumber(1)}
//           disabled={
//             isPending || isError || pageNumber <= 1 || numPages === 0
//           }
//           className="p-2 text-xs bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//           title="First page"
//         >
//           <svg
//             className="w-4 h-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
//             />
//           </svg>
//         </button>

//         <button
//           onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
//           disabled={
//             isPending || isError || pageNumber <= 1 || numPages === 0
//           }
//           className="px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
//           title="Previous page"
//         >
//           Previous
//         </button>

//         <button
//           onClick={() =>
//             setPageNumber((prev) => Math.min(prev + 1, numPages))
//           }
//           disabled={
//             isPending || isError || pageNumber >= numPages || numPages === 0
//           }
//           className="px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
//           title="Next page"
//         >
//           Next
//         </button>

//         <button
//           onClick={() => setPageNumber(numPages)}
//           disabled={
//             isPending || isError || pageNumber >= numPages || numPages === 0
//           }
//           className="p-2 text-xs bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//           title="Last page"
//         >
//           <svg
//             className="w-4 h-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M13 5l7 7-7 7M5 5l7 7-7 7"
//             />
//           </svg>
//         </button>
//       </div>
//     </div>
//   </div>
// </div>
