import AdminShell from "@/components/AdminShell";

const projects = [
  ["NOVA STUDIO", "Building a brand system designed to scale", "Published"],
  ["FORME", "Turning a simple idea into campaign attention", "Published"],
  ["KIN", "Making everyday products feel launch-worthy", "Published"],
];

export default function AdminProjectsPage() {
  return (
    <AdminShell
      title="Projects"
      subtitle="Manage portfolio projects, case studies, media links, services, and team assignments."
    >
      <div className="admin-toolbar">
        <div className="admin-search">
          <input placeholder="Search projects..." type="search" />
        </div>
        <button className="admin-btn admin-btn-primary" type="button">
          + New Project
        </button>
      </div>

      <section className="admin-panel">
        <div className="admin-list">
          {projects.map(([client, title, status]) => (
            <div className="admin-list-row admin-project-row" key={client}>
              <div>
                <strong>{client}</strong>
                <span>{title}</span>
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
            <p className="admin-eyebrow">Project editor preview</p>
            <h2>Project details</h2>
          </div>
        </div>

        <div className="admin-form-grid">
          <label>
            <span>Project title</span>
            <input placeholder="Project title" type="text" />
          </label>

          <label>
            <span>Client / project name</span>
            <input placeholder="Client or project" type="text" />
          </label>

          <label>
            <span>Slug</span>
            <input placeholder="project-slug" type="text" />
          </label>

          <label>
            <span>Status</span>
            <select defaultValue="draft">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>

          <label className="admin-full-field">
            <span>Short overview</span>
            <textarea rows="4" placeholder="Short project overview" />
          </label>

          <label className="admin-full-field">
            <span>Challenge</span>
            <textarea rows="4" placeholder="What needed to be solved?" />
          </label>

          <label className="admin-full-field">
            <span>Floowp Response</span>
            <textarea rows="4" placeholder="What did Floowp do?" />
          </label>

          <label className="admin-full-field">
            <span>Result</span>
            <textarea rows="4" placeholder="What changed or improved?" />
          </label>

          <label>
            <span>Cover image URL</span>
            <input placeholder="https://..." type="url" />
          </label>

          <label>
            <span>Video URL</span>
            <input placeholder="YouTube, Vimeo, Drive, or public URL" type="url" />
          </label>
        </div>
      </section>
    </AdminShell>
  );
}
