import ProjectTable from "@/components/allProjects";

export default function Projects() {
  return (
    <section className="m-5">
      <h2 className="font-semibold text-2xl">All Projects</h2>
      <ProjectTable />
      {/* <DataTable columns={columns} data={projects} /> */}
    </section>
  );
}
