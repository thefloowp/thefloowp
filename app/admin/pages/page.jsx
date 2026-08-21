import Link from "next/link";
import AdminShell from "@/components/AdminShell";

const pageCards = [
  ["home", "Home", "Hero, intro, selected work, loop, collective, CTA"],
  ["about", "About", "Hero, Flow + Loop, brand belief, brand voice"],
  ["floowproof", "Floowproof", "Hero and Floowproof principles"],
  ["contact", "Contact", "Hero, contact copy and form labels"],
];

export default function AdminPagesPage() {
  return (
    <AdminShell
      title="Pages"
      subtitle="Choose a page to open its content editor."
    >
      <div className="admin-card-grid">
        {pageCards.map(([slug, name, description]) => (
          <article className="admin-manage-card" key={slug}>
            <div>
              <p className="admin-eyebrow">Page</p>
              <h2>{name}</h2>
              <p>{description}</p>
            </div>

            <Link
              className="admin-text-button"
              href={`/admin/pages/${slug}`}
            >
              Edit page →
            </Link>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
