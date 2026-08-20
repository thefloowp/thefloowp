import { notFound } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import { getMember, team } from "@/data/team";
import { projects } from "@/data/projects";

export function generateStaticParams() {
  return team.map((member) => ({ slug: member.slug }));
}

export default async function TeamMemberPage({ params }) {
  const { slug } = await params;
  const member = getMember(slug);

  if (!member) notFound();

  const memberProjects = projects.filter((project) =>
    member.projects.includes(project.slug)
  );

  return (
    <>
      <section className="member-hero">
        <div className="member-initials">{member.initials}</div>
        <div>
          <p className="eyebrow">The Collective</p>
          <h1>{member.name}</h1>
          <p className="member-role">{member.role}</p>
          <p className="lead">{member.bio}</p>
        </div>
      </section>

      <section className="section border-top">
        <div className="two-column">
          <div>
            <p className="eyebrow">Expertise</p>
            <h2>Where the work moves.</h2>
          </div>
          <div className="tag-list">
            {member.expertise.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section inverted">
        <p className="eyebrow">Selected Work</p>
        <h2 className="section-heading">Contributions across Floowp.</h2>
        <div className="project-grid">
          {memberProjects.map((project) => (
            <ProjectCard project={project} key={project.slug} />
          ))}
        </div>
      </section>
    </>
  );
}
