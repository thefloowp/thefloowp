import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { getMergedTeamMembers } from "@/lib/teamDirectory";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const members = await getMergedTeamMembers({ includeInactive: true });

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
          {members.map((member) => (
            <div className="admin-list-row" key={member.slug}>
              <div>
                <strong>{member.name}</strong>
                <span>{member.role}</span>
              </div>

              <div className="admin-row-actions">
                <span className="admin-pill">{member.status}</span>
                <Link
                  className="admin-text-button"
                  href={`/admin/team/${member.slug}`}
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
