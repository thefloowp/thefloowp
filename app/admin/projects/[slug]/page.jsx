import Link from "next/link";
import AdminShell from "@/components/AdminShell";

const projectData = {
  "nova-studio": {
    client: "NOVA STUDIO",
    title: "Building a brand system designed to scale",
    slug: "nova-studio",
    status: "published",
    overview:
      "A connected brand system designed to create a clearer identity, stronger communication, and a more scalable creative foundation.",
  },
  forme: {
    client: "FORME",
    title: "Turning a simple idea into campaign attention",
    slug: "forme",
    status: "published",
    overview:
      "A social-first campaign direction built around strong visual storytelling, clear communication, and audience interaction.",
  },
  kin: {
    client: "KIN",
    title: "Making everyday products feel launch-worthy",
    slug: "kin",
    status: "published",
    overview:
      "A launch framework designed to transform an everyday product into a clearer, more cohesive, and more compelling brand experience.",
  },
};

export default async function AdminProjectEditor({ params }) {
  const { slug } = await params;
  const isNew = slug === "new";

  const project = isNew
    ? {
        client: "",
        title: "",
        slug: "",
        status: "draft",
        overview: "",
      }
    : projectData[slug] || {
        client: "",
        title: "",
        slug,
        status: "draft",
        overview: "",
      };

  return (
    <AdminShell
      title={isNew ? "New Project" : `Edit ${project.client || "Project"}`}
      subtitle="Build the project case study, assign media, and control publishing."
    >
      <div className="admin-toolbar">
        <Link className="admin-btn admin-btn-secondary" href="/admin/projects">
          ← Back to Projects
        </Link>
      </div>

      <section className="admin-panel">
        <div className="admin-form-grid">
          <label>
            <span>Project title</span>
            <input defaultValue={project.title} placeholder="Project title" />
          </label>

          <label>
            <span>Client / project name</span>
            <input defaultValue={project.client} placeholder="Client or project" />
          </label>

          <label>
            <span>Slug</span>
            <input defaultValue={project.slug} placeholder="project-slug" />
          </label>

          <label>
            <span>Status</span>
            <select defaultValue={project.status}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>

          <label className="admin-full-field">
            <span>Short overview</span>
            <textarea defaultValue={project.overview} rows="4" />
          </label>

          <label className="admin-full-field">
            <span>Challenge</span>
            <textarea rows="4" />
          </label>

          <label className="admin-full-field">
            <span>Floowp Response</span>
            <textarea rows="4" />
          </label>

          <label className="admin-full-field">
            <span>Result</span>
            <textarea rows="4" />
          </label>

          <label>
            <span>Cover image URL</span>
            <input placeholder="https://..." type="url" />
          </label>

          <label>
            <span>Video URL</span>
            <input placeholder="YouTube, Vimeo, Drive, or public URL" type="url" />
          </label>

          <label className="admin-full-field">
            <span>Gallery image URLs</span>
            <textarea
              placeholder="One public image URL per line"
              rows="5"
            />
          </label>

          <label className="admin-full-field">
            <span>Team members</span>
            <input placeholder="Select team members later" />
          </label>

          <label className="admin-full-field">
            <span>Services</span>
            <input placeholder="Select services later" />
          </label>
        </div>
      </section>

      <section className="admin-panel admin-panel-soft">
        <p className="admin-eyebrow">Persistence</p>
        <h2>Editor is active; saving is not connected yet.</h2>
        <p className="admin-body-copy">
          Once Supabase is connected, this same screen will create and update
          actual project records.
        </p>
      </section>
    </AdminShell>
  );
}
