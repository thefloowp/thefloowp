import AdminShell from "@/components/AdminShell";

const stats = [
  ["Projects", "3", "3 published"],
  ["Team Members", "3", "3 active"],
  ["Services", "6", "6 visible"],
  ["Drafts", "0", "Nothing waiting"],
];

const activity = [
  ["Homepage", "Hero and selected work", "Edited recently"],
  ["Projects", "Portfolio collection", "3 published"],
  ["Team", "Collective profiles", "3 active"],
];

export default function AdminDashboardPage() {
  return (
    <AdminShell
      title="Dashboard"
      subtitle="Manage the content behind Floowp without touching the public layout."
    >
      <section className="admin-stat-grid">
        {stats.map(([label, value, note]) => (
          <article className="admin-stat-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <p>{note}</p>
          </article>
        ))}
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Overview</p>
            <h2>Content status</h2>
          </div>
        </div>

        <div className="admin-list">
          {activity.map(([title, description, status]) => (
            <div className="admin-list-row" key={title}>
              <div>
                <strong>{title}</strong>
                <span>{description}</span>
              </div>
              <span className="admin-status">{status}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-panel admin-panel-soft">
        <p className="admin-eyebrow">Current stage</p>
        <h2>UI foundation only</h2>
        <p className="admin-body-copy">
          These controls are intentionally not connected to Supabase yet. This
          build is for reviewing the admin structure, fields, and editing flow
          before we make anything persistent.
        </p>
      </section>
    </AdminShell>
  );
}
