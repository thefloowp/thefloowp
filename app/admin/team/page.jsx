import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { getTeamMembers } from "@/lib/teamAdmin";

const fallbackMembers = [
  ["francesca-navarro", "Francesca Navarro", "Creative Direction & Marketing", "Active"],
  ["alex-rivera", "Alex Rivera", "Design & Brand Systems", "Active"],
  ["sam-lee", "Sam Lee", "Content & Digital", "Active"],
];

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  let members = fallbackMembers;

  try {
    const savedMembers = await getTeamMembers();

    if (savedMembers.length) {
      members = savedMembers.map((member) => [
        member.slug,
        member.name,
        member.role,
        member.status || "Active",
      ]);
    }
  } catch {
    // Keep fallback list until Supabase is initialized.
  }

  return (
    <AdminShell
      title="Team"
      subtitle="Manage Collective profiles and the work that appears in each member portfolio."
    >
      <div className="admin-toolbar">
        <div />
        <Link className="admin-btn admin-btn-primary" href="/admin/team/new">
          + Add Team Member
        </Link>
      </div>

      <section className="admin-panel">
        <div className="admin-list">
          {members.map(([slug, name, role, status]) => (
            <div className="admin-list-row" key={slug}>
              <div>
                <strong>{name}</strong>
                <span>{role}</span>
              </div>

              <div className="admin-row-actions">
                <span className="admin-pill">{status}</span>
                <Link
                  className="admin-text-button"
                  href={`/admin/team/${slug}`}
                >
                  Edit →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
