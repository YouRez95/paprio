import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface DataTableSkeletonProps {
  columns?: number;
  rows?: number;
}

export default function DataTableSkeleton({
  columns = 5,
  rows = 5,
}: DataTableSkeletonProps) {
  return (
    <div>
      {/* Top bar with search + placeholder actions */}
      <div className="flex items-center py-4 justify-between">
        <Skeleton className="h-10 w-64 rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-20 rounded" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: columns }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Bottom pagination skeleton */}
      <div className="flex items-center justify-between pt-4">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            <Skeleton className="h-4 w-12" />
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Skeleton className="h-4 w-12" />
          </Button>
        </div>
      </div>
    </div>
  );
}
