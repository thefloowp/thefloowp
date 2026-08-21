import AdminShell from "@/components/AdminShell";

const pageCards = [
  ["Home", "Hero, intro, selected work, loop, collective, CTA"],
  ["About", "Hero, Flow + Loop, brand belief, brand voice"],
  ["Floowproof", "Hero and Floowproof principles"],
  ["Contact", "Hero, contact copy and form labels"],
];

export default function AdminPagesPage() {
  return (
    <AdminShell
      title="Pages"
      subtitle="Edit page copy while keeping the public site design protected."
    >
      <div className="admin-card-grid">
        {pageCards.map(([name, description]) => (
          <article className="admin-manage-card" key={name}>
            <div>
              <p className="admin-eyebrow">Page</p>
              <h2>{name}</h2>
              <p>{description}</p>
            </div>
            <button className="admin-text-button" type="button">
              Edit page →
            </button>
          </article>
        ))}
      </div>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Example editor</p>
            <h2>Homepage Hero</h2>
          </div>
        </div>

        <div className="admin-form-grid">
          <label>
            <span>Eyebrow</span>
            <input
              defaultValue="Collaborative marketing agency + creative studio"
              type="text"
            />
          </label>

          <label>
            <span>Primary tagline</span>
            <input defaultValue="Never Static." type="text" />
          </label>

          <label className="admin-full-field">
            <span>Secondary tagline</span>
            <input
              defaultValue="The Flow to Convert. The Loop to Scale."
              type="text"
            />
          </label>
        </div>
      </section>
    </AdminShell>
  );
}
