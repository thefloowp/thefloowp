import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import AdminTeamList from "@/components/AdminTeamList";
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
        <AdminTeamList initialMembers={members} />
      </section>
    </AdminShell>
  );
}
