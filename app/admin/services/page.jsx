import Link from "next/link";
import AdminShell from "@/components/AdminShell";

const serviceGroups = [
  ["brand-strategy", "01", "Brand & Strategy", "6 services"],
  ["creative", "02", "Creative", "6 services"],
  ["digital-social", "03", "Digital & Social", "5 services"],
  ["performance-growth", "04", "Performance & Growth", "6 services"],
  ["ecommerce", "05", "E-Commerce", "6 services"],
  ["technology", "06", "Technology", "6 services"],
];

export default function AdminServicesPage() {
  return (
    <AdminShell
      title="Services"
      subtitle="Add, rename, reorder, hide, or remove service groups and individual services."
    >
      <div className="admin-toolbar">
        <div />
        <Link
          className="admin-btn admin-btn-primary"
          href="/admin/services/new"
        >
          + Add Service Group
        </Link>
      </div>

      <section className="admin-panel">
        <div className="admin-list">
          {serviceGroups.map(([slug, number, name, count]) => (
            <div className="admin-list-row" key={slug}>
              <div className="admin-service-title">
                <span>{number}</span>
                <div>
                  <strong>{name}</strong>
                  <span>{count}</span>
                </div>
              </div>

              <div className="admin-row-actions">
                <Link
                  className="admin-text-button"
                  href={`/admin/services/${slug}`}
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
