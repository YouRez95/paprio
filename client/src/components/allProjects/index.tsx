import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useSearchParams } from "react-router";
import { useGetProjects } from "@/hooks/useProjects";
import DataTableSkeleton from "../skeletons/DataTableSkeleton";

export default function ProjectTable() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data: projectsData, isPending } = useGetProjects({
    limit,
    page,
    search: debouncedSearchTerm,
    tag: searchParams.get("tag") || "",
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  if (isPending || !projectsData)
    return <DataTableSkeleton columns={6} rows={8} />;

  const { pagination, projects } = projectsData;

  return (
    <DataTable
      columns={columns}
      data={projects}
      page={page}
      pageCount={pagination.pages}
      onPageChange={setPage}
      setSearchTerm={setSearchTerm}
      searchTerm={searchTerm}
    />
  );
}
