import Link from "next/link";
import AdminShell from "@/components/AdminShell";

const teamData = {
  "francesca-navarro": {
    name: "Francesca Navarro",
    role: "Creative Direction & Marketing",
    photo: "",
    order: 1,
    bio: "Works across brand strategy, creative direction, campaign planning, e-commerce, and connected marketing execution.",
    expertise:
      "Creative Direction, Brand Strategy, Campaign Strategy, E-Commerce, Growth Marketing",
  },
  "alex-rivera": {
    name: "Alex Rivera",
    role: "Design & Brand Systems",
    photo: "",
    order: 2,
    bio: "Builds visual systems and campaign identities that keep brands clear, consistent, and adaptable across touchpoints.",
    expertise:
      "Brand Identity, Graphic Design, Campaign Design, Art Direction, Visual Systems",
  },
  "sam-lee": {
    name: "Sam Lee",
    role: "Content & Digital",
    photo: "",
    order: 3,
    bio: "Shapes content into platform-ready stories designed for attention, relevance, and continuous iteration.",
    expertise:
      "Content Strategy, Social Media, Performance Creative, Video Direction, Digital Campaigns",
  },
};

export default async function AdminTeamEditor({ params }) {
  const { slug } = await params;
  const isNew = slug === "new";

  const member = isNew
    ? {
        name: "",
        role: "",
        photo: "",
        order: 1,
        bio: "",
        expertise: "",
      }
    : teamData[slug] || {
        name: "",
        role: "",
        photo: "",
        order: 1,
        bio: "",
        expertise: "",
      };

  return (
    <AdminShell
      title={isNew ? "New Team Member" : `Edit ${member.name}`}
      subtitle="Manage profile information and portfolio presentation."
    >
      <div className="admin-toolbar">
        <Link className="admin-btn admin-btn-secondary" href="/admin/team">
          ← Back to Team
        </Link>
      </div>

      <section className="admin-panel">
        <div className="admin-form-grid">
          <label>
            <span>Name</span>
            <input defaultValue={member.name} placeholder="Full name" />
          </label>

          <label>
            <span>Role</span>
            <input defaultValue={member.role} placeholder="Role / discipline" />
          </label>

          <label>
            <span>Profile photo URL</span>
            <input
              defaultValue={member.photo}
              placeholder="https://..."
              type="url"
            />
          </label>

          <label>
            <span>Display order</span>
            <input defaultValue={member.order} min="1" type="number" />
          </label>

          <label className="admin-full-field">
            <span>Short bio</span>
            <textarea defaultValue={member.bio} rows="4" />
          </label>

          <label className="admin-full-field">
            <span>Expertise</span>
            <input defaultValue={member.expertise} />
          </label>

          <label className="admin-full-field">
            <span>Social / portfolio link</span>
            <input placeholder="https://..." type="url" />
          </label>
        </div>
      </section>

      <section className="admin-panel admin-panel-soft">
        <p className="admin-eyebrow">Portfolio relationship</p>
        <h2>Assigned projects will appear automatically.</h2>
        <p className="admin-body-copy">
          Once the data layer is connected, projects assigned to this member
          will populate their public portfolio automatically.
        </p>
      </section>
    </AdminShell>
  );
}
