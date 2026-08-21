import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/AdminShell";

const pageData = {
  home: {
    name: "Home",
    preview: "/",
    fields: [
      ["Eyebrow", "Collaborative marketing agency + creative studio"],
      ["Primary tagline", "Never Static."],
      ["Secondary tagline", "The Flow to Convert. The Loop to Scale."],
      [
        "Intro statement",
        "We build brands that move — from launch to conversion, from conversion to scale.",
      ],
      ["Selected Work heading", "Work designed to keep moving."],
      [
        "Selected Work description",
        "Strategy, creativity, commerce, and growth connected into one system.",
      ],
      ["Loop heading", "Flow. Learn. Optimize. Scale."],
      [
        "Loop description",
        "Floowp is built around continuous movement rather than one-off execution.",
      ],
      ["Team heading", "Different disciplines. One moving system."],
      ["Team description", "Meet the people behind the work."],
      ["CTA eyebrow", "Have something in motion?"],
      ["CTA heading", "Let’s make it Floowproof."],
    ],
  },
  about: {
    name: "About",
    preview: "/about",
    fields: [
      ["Hero eyebrow", "About Floowp"],
      ["Hero heading", "Never Static."],
      [
        "Hero introduction",
        "Floowp is a collaborative marketing agency and creative studio built around one belief: brands should never stand still.",
      ],
      ["The Name heading", "Flow + Loop"],
      [
        "Flow description",
        "Flow is how brands move from strategy to identity, from launch to content, and from attention to conversion.",
      ],
      [
        "Loop description",
        "Loop is what happens next: learning, optimizing, refining, and scaling what works.",
      ],
      ["Brand Belief heading", "Movement is the system."],
      ["Brand Voice heading", "We are Floowp."],
    ],
  },
  floowproof: {
    name: "Floowproof",
    preview: "/floowproof",
    fields: [
      ["Hero eyebrow", "The Floowproof Standard"],
      ["Hero heading", "If it’s Floowproof, it just works."],
      [
        "Hero introduction",
        "Floowproof is our standard for making brands simple, clear, adaptable, and impossible to ignore.",
      ],
      ["Principle 1", "Clear."],
      ["Principle 1 description", "People immediately understand the brand."],
      ["Principle 2", "Consistent."],
      [
        "Principle 2 description",
        "Every platform feels unmistakably connected.",
      ],
      ["Principle 3", "Convertible."],
      [
        "Principle 3 description",
        "Creative does more than look good — it moves people.",
      ],
      ["Principle 4", "Scalable."],
      [
        "Principle 4 description",
        "The system can grow without losing identity.",
      ],
    ],
  },
  contact: {
    name: "Contact",
    preview: "/contact",
    fields: [
      ["Hero eyebrow", "Contact"],
      ["Hero heading", "Have something in motion?"],
      ["Hero introduction", "Tell us what you’re building."],
      ["Name field label", "Name"],
      ["Company field label", "Company"],
      ["Email field label", "Email"],
      ["Brief field label", "What do you need help with?"],
      ["CTA label", "Start a Project →"],
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(pageData).map((slug) => ({ slug }));
}

export default async function AdminPageEditor({ params }) {
  const { slug } = await params;
  const page = pageData[slug];

  if (!page) notFound();

  return (
    <AdminShell
      title={`Edit ${page.name}`}
      subtitle="Edit the content fields below. The design and layout remain protected."
    >
      <div className="admin-toolbar">
        <Link className="admin-btn admin-btn-secondary" href="/admin/pages">
          ← Back to Pages
        </Link>

        <Link
          className="admin-btn admin-btn-secondary"
          href={page.preview}
          target="_blank"
        >
          Preview public page ↗
        </Link>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">{page.name}</p>
            <h2>Page content</h2>
          </div>
        </div>

        <div className="admin-form-grid">
          {page.fields.map(([label, value], index) => (
            <label
              className={value.length > 90 ? "admin-full-field" : ""}
              key={`${label}-${index}`}
            >
              <span>{label}</span>
              {value.length > 90 ? (
                <textarea defaultValue={value} rows="4" />
              ) : (
                <input defaultValue={value} type="text" />
              )}
            </label>
          ))}
        </div>
      </section>

      <section className="admin-panel admin-panel-soft">
        <p className="admin-eyebrow">Persistence</p>
        <h2>Saving comes next.</h2>
        <p className="admin-body-copy">
          The editor route is now fully clickable. These fields are still
          UI-only until we connect Supabase, so changing a field here will not
          change the live site yet.
        </p>
      </section>
    </AdminShell>
  );
}
