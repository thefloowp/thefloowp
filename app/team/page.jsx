import TeamCard from "@/components/TeamCard";
import { getMergedTeamMembers } from "@/lib/teamDirectory";

export const metadata = { title: "Team" };
export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const members = await getMergedTeamMembers();

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
          {members.map((member) => (
            <TeamCard member={member} key={member.slug} />
          ))}
        </div>
      </section>
    </>
  );
}
