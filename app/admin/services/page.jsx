import AdminShell from "@/components/AdminShell";

const serviceGroups = [
  ["01", "Brand & Strategy", "6 services"],
  ["02", "Creative", "6 services"],
  ["03", "Digital & Social", "5 services"],
  ["04", "Performance & Growth", "6 services"],
  ["05", "E-Commerce", "6 services"],
  ["06", "Technology", "6 services"],
];

export default function AdminServicesPage() {
  return (
    <AdminShell
      title="Services"
      subtitle="Add, rename, reorder, hide, or remove service groups and individual services."
    >
      <div className="admin-toolbar">
        <div />
        <button className="admin-btn admin-btn-primary" type="button">
          + Add Service Group
        </button>
      </div>

      <section className="admin-panel">
        <div className="admin-list">
          {serviceGroups.map(([number, name, count]) => (
            <div className="admin-list-row" key={number}>
              <div className="admin-service-title">
                <span>{number}</span>
                <div>
                  <strong>{name}</strong>
                  <span>{count}</span>
                </div>
              </div>

              <div className="admin-row-actions">
                <button className="admin-text-button" type="button">
                  Reorder
                </button>
                <button className="admin-text-button" type="button">
                  Edit →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
