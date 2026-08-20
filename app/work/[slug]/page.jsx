import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { team } from "@/data/team";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const members = team.filter((member) => project.team.includes(member.slug));

  return (
    <>
      <section className="page-hero project-detail-hero">
        <p className="eyebrow">{project.category}</p>
        <h1>{project.title}</h1>
        <p className="lead">{project.summary}</p>
      </section>

      <section className="project-cover">
        <span>{project.number}</span>
        <strong>{project.client}</strong>
      </section>

      <section className="section">
        <div className="case-grid">
          <div>
            <p className="eyebrow">Challenge</p>
            <p className="case-copy">{project.challenge}</p>
          </div>
          <div>
            <p className="eyebrow">Floowp Response</p>
            <p className="case-copy">{project.response}</p>
          </div>
          <div>
            <p className="eyebrow">Result</p>
            <p className="case-copy">{project.result}</p>
          </div>
        </div>
      </section>

      <section className="section border-top">
        <div className="two-column">
          <div>
            <p className="eyebrow">Services</p>
            <h2>What moved this project.</h2>
          </div>
          <div className="tag-list">
            {project.services.map((service) => (
              <span key={service}>{service}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section inverted">
        <p className="eyebrow">Project Team</p>
        <div className="simple-list">
          {members.map((member) => (
            <Link href={`/team/${member.slug}`} key={member.slug}>
              <span>{member.name}</span>
              <span>{member.role} ↗</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
