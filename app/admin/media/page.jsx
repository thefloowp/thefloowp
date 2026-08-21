import AdminShell from "@/components/AdminShell";

export default function AdminMediaPage() {
  return (
    <AdminShell
      title="Media Links"
      subtitle="Save reusable image and video links without uploading media files into Floowp."
    >
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">New media link</p>
            <h2>Add external media</h2>
          </div>
        </div>

        <div className="admin-form-grid">
          <label>
            <span>Name</span>
            <input placeholder="Campaign hero image" type="text" />
          </label>

          <label>
            <span>Type</span>
            <select defaultValue="image">
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </label>

          <label>
            <span>Source</span>
            <select defaultValue="direct">
              <option value="direct">Direct / Public URL</option>
              <option value="google-drive">Google Drive</option>
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
            </select>
          </label>

          <label>
            <span>Media URL</span>
            <input placeholder="https://..." type="url" />
          </label>

          <label className="admin-full-field">
            <span>Alt text / description</span>
            <input placeholder="Describe the image or video" type="text" />
          </label>
        </div>

        <div className="admin-inline-actions">
          <button className="admin-btn admin-btn-secondary" type="button">
            Test Preview
          </button>
          <button className="admin-btn admin-btn-primary" type="button">
            Add Media Link
          </button>
        </div>
      </section>

      <section className="admin-panel admin-empty-state">
        <p className="admin-eyebrow">Library</p>
        <h2>No reusable media links yet.</h2>
        <p>
          Once connected to Supabase, saved links will appear here and can be
          reused across projects and pages.
        </p>
      </section>
    </AdminShell>
  );
}
