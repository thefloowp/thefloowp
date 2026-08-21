import Link from "next/link";
import AdminShell from "@/components/AdminShell";

const projects = [
  ["nova-studio", "NOVA STUDIO", "Building a brand system designed to scale", "Published"],
  ["forme", "FORME", "Turning a simple idea into campaign attention", "Published"],
  ["kin", "KIN", "Making everyday products feel launch-worthy", "Published"],
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

        <Link className="admin-btn admin-btn-primary" href="/admin/projects/new">
          + New Project
        </Link>
      </div>

      <section className="admin-panel">
        <div className="admin-list">
          {projects.map(([slug, client, title, status]) => (
            <div className="admin-list-row admin-project-row" key={slug}>
              <div>
                <strong>{client}</strong>
                <span>{title}</span>
              </div>

              <div className="admin-row-actions">
                <span className="admin-pill">{status}</span>
                <Link
                  className="admin-text-button"
                  href={`/admin/projects/${slug}`}
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
