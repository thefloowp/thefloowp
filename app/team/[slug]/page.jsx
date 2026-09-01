import { notFound } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { getMergedTeamMember } from "@/lib/teamDirectory";

export const dynamic = "force-dynamic";

export default async function TeamMemberPage({ params }) {
  const { slug } = await params;
  const member = await getMergedTeamMember(slug);

  if (!member) notFound();

  const memberProjects = projects.filter((project) =>
    member.projects.includes(project.slug)
  );

  return (
    <>
      <section className="member-hero">
        {member.photo_url ? (
          <div className="member-initials member-photo-wrap">
            <img
              className="member-photo-image"
              src={member.photo_url}
              alt={member.name}
            />
          </div>
        ) : (
          <div className="member-initials">{member.initials}</div>
        )}

        <div>
          <p className="eyebrow">The Collective</p>
          <h1>{member.name}</h1>
          <p className="member-role">{member.role}</p>
          {member.bio ? <p className="lead">{member.bio}</p> : null}

          {member.social_url ? (
            <a
              className="text-link"
              href={member.social_url}
              target="_blank"
              rel="noreferrer"
            >
              Portfolio / Social ↗
            </a>
          ) : null}
        </div>
      </section>

      {member.expertise.length ? (
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
      ) : null}

      {memberProjects.length ? (
        <section className="section inverted">
          <p className="eyebrow">Selected Work</p>
          <h2 className="section-heading">Contributions across Floowp.</h2>
          <div className="project-grid">
            {memberProjects.map((project) => (
              <ProjectCard project={project} key={project.slug} />
            ))}
          </div>
        </section>
      ) : null}

      <style>{`
        .member-photo-wrap {
          padding: 0;
          overflow: hidden;
        }

        .member-photo-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      `}</style>
    </>
  );
}
