import AdminShell from "@/components/AdminShell";

export default function AdminSettingsPage() {
  return (
    <AdminShell
      title="Site Settings"
      subtitle="Control global Floowp branding, navigation, footer content, social links, and SEO."
    >
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Brand</p>
            <h2>Global identity</h2>
          </div>
        </div>

        <div className="admin-form-grid">
          <label>
            <span>Site name</span>
            <input defaultValue="Floowp" type="text" />
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

          <label>
            <span>Black logo URL</span>
            <input defaultValue="/floowp-bk.png" type="text" />
          </label>

          <label>
            <span>White logo URL</span>
            <input defaultValue="/floowp-wt.png" type="text" />
          </label>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">SEO</p>
            <h2>Default metadata</h2>
          </div>
        </div>

        <div className="admin-form-grid">
          <label className="admin-full-field">
            <span>Default site title</span>
            <input defaultValue="Floowp — Never Static" type="text" />
          </label>

          <label className="admin-full-field">
            <span>Default description</span>
            <textarea
              defaultValue="Floowp is a collaborative marketing agency and creative studio."
              rows="4"
            />
          </label>

          <label className="admin-full-field">
            <span>Social sharing image URL</span>
            <input placeholder="https://..." type="url" />
          </label>
        </div>
      </section>
    </AdminShell>
  );
}
