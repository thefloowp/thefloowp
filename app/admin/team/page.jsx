import AdminShell from "@/components/AdminShell";

const members = [
  ["Francesca Navarro", "Creative Direction & Marketing", "Active"],
  ["Alex Rivera", "Design & Brand Systems", "Active"],
  ["Sam Lee", "Content & Digital", "Active"],
];

export default function AdminTeamPage() {
  return (
    <AdminShell
      title="Team"
      subtitle="Manage Collective profiles and the work that appears in each member portfolio."
    >
      <div className="admin-toolbar">
        <div />
        <button className="admin-btn admin-btn-primary" type="button">
          + Add Team Member
        </button>
      </div>

      <section className="admin-panel">
        <div className="admin-list">
          {members.map(([name, role, status]) => (
            <div className="admin-list-row" key={name}>
              <div>
                <strong>{name}</strong>
                <span>{role}</span>
              </div>
              <div className="admin-row-actions">
                <span className="admin-pill">{status}</span>
                <button className="admin-text-button" type="button">
                  Edit →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Profile editor preview</p>
            <h2>Team member</h2>
          </div>
        </div>

        <div className="admin-form-grid">
          <label>
            <span>Name</span>
            <input placeholder="Full name" type="text" />
          </label>

          <label>
            <span>Role</span>
            <input placeholder="Role / discipline" type="text" />
          </label>

          <label>
            <span>Profile photo URL</span>
            <input placeholder="https://..." type="url" />
          </label>

          <label>
            <span>Display order</span>
            <input defaultValue="1" min="1" type="number" />
          </label>

          <label className="admin-full-field">
            <span>Short bio</span>
            <textarea rows="4" placeholder="Short profile introduction" />
          </label>

          <label className="admin-full-field">
            <span>Expertise</span>
            <input
              placeholder="Creative Direction, Strategy, Design..."
              type="text"
            />
          </label>
        </div>
      </section>
    </AdminShell>
  );
}
