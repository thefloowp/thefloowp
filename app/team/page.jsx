import TeamCard from "@/components/TeamCard";
import { team } from "@/data/team";

export const metadata = { title: "Team" };

export default function TeamPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">The Collective</p>
        <h1>Built by different disciplines.</h1>
        <p className="lead">
          Strategy, creativity, technology, and commerce — built together.
        </p>
      </section>

      <section className="section">
        <div className="team-grid">
          {team.map((member) => (
            <TeamCard member={member} key={member.slug} />
          ))}
        </div>
      </section>
    </>
  );
}
