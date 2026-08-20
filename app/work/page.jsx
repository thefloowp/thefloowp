import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export const metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Selected Work</p>
        <h1>Proof of movement.</h1>
        <p className="lead">
          Projects that connect brand thinking, creative execution, and growth.
        </p>
      </section>

      <section className="section">
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard project={project} key={project.slug} />
          ))}
        </div>
      </section>
    </>
  );
}
