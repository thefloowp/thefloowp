import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import TeamEditor from "@/components/TeamEditor";
import { getTeamMember } from "@/lib/teamAdmin";

const fallbackTeam = {
  "francesca-navarro": {
    name: "Francesca Navarro",
    role: "Creative Direction & Marketing",
    photo_url: "",
    display_order: 1,
    bio:
      "Works across brand strategy, creative direction, campaign planning, e-commerce, and connected marketing execution.",
    expertise:
      "Creative Direction, Brand Strategy, Campaign Strategy, E-Commerce, Growth Marketing",
    social_url: "",
    status: "Active",
  },
  "alex-rivera": {
    name: "Alex Rivera",
    role: "Design & Brand Systems",
    photo_url: "",
    display_order: 2,
    bio:
      "Builds visual systems and campaign identities that keep brands clear, consistent, and adaptable across touchpoints.",
    expertise:
      "Brand Identity, Graphic Design, Campaign Design, Art Direction, Visual Systems",
    social_url: "",
    status: "Active",
  },
  "sam-lee": {
    name: "Sam Lee",
    role: "Content & Digital",
    photo_url: "",
    display_order: 3,
    bio:
      "Shapes content into platform-ready stories designed for attention, relevance, and continuous iteration.",
    expertise:
      "Content Strategy, Social Media, Performance Creative, Video Direction, Digital Campaigns",
    social_url: "",
    status: "Active",
  },
};

export const dynamic = "force-dynamic";

export default async function AdminTeamEditor({ params }) {
  const { slug } = await params;
  const isNew = slug === "new";

  let member = isNew
    ? {
        name: "",
        role: "",
        photo_url: "",
        display_order: 1,
        bio: "",
        expertise: "",
        social_url: "",
        status: "Active",
      }
    : fallbackTeam[slug] || {
        name: "",
        role: "",
        photo_url: "",
        display_order: 1,
        bio: "",
        expertise: "",
        social_url: "",
        status: "Active",
      };

  if (!isNew) {
    try {
      const saved = await getTeamMember(slug);
      if (saved) member = saved;
    } catch {
      // Keep fallback data if Supabase has not been initialized yet.
    }
  }

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

      <TeamEditor initialMember={member} slug={slug} />

      <section className="admin-panel admin-panel-soft">
        <p className="admin-eyebrow">Portfolio relationship</p>
        <h2>Assigned projects will appear automatically.</h2>
        <p className="admin-body-copy">
          Projects associated with this member can be surfaced in their public
          portfolio without storing unsaved edits in the browser.
        </p>
      </section>
    </AdminShell>
  );
}
