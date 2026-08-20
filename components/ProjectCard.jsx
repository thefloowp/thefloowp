import Link from "next/link";

export default function ProjectCard({ project }) {
  return (
    <Link className="project-card" href={`/work/${project.slug}`}>
      <div className="project-visual">
        <span>{project.number}</span>
        <strong>{project.client}</strong>
      </div>
      <div className="project-meta">
        <div>
          <p className="eyebrow">{project.category}</p>
          <h3>{project.title}</h3>
        </div>
        <span className="arrow">↗</span>
      </div>
    </Link>
  );
}
