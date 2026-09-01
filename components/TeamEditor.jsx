"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function TeamEditor({ initialMember, slug }) {
  const router = useRouter();

  const normalizedInitial = useMemo(
    () => ({
      name: initialMember?.name || "",
      role: initialMember?.role || "",
      photo_url: initialMember?.photo_url || "",
      display_order: initialMember?.display_order || 1,
      bio: initialMember?.bio || "",
      expertise: initialMember?.expertise || "",
      social_url: initialMember?.social_url || "",
      status: initialMember?.status || "Active",
    }),
    [initialMember]
  );

  const [form, setForm] = useState(normalizedInitial);
  const [savedForm, setSavedForm] = useState(normalizedInitial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dirty = JSON.stringify(form) !== JSON.stringify(savedForm);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage("");
    setError("");
  }

  async function save() {
    if (!dirty || saving) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/team/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to save changes.");
      }

      const saved = {
        name: data.member?.name || form.name,
        role: data.member?.role || form.role,
        photo_url: data.member?.photo_url || "",
        display_order: data.member?.display_order || 1,
        bio: data.member?.bio || "",
        expertise: data.member?.expertise || "",
        social_url: data.member?.social_url || "",
        status: data.member?.status || "Active",
      };

      setForm(saved);
      setSavedForm(saved);
      setMessage("Saved ✓");

      if (slug === "new" && data.slug) {
        router.replace(`/admin/team/${data.slug}`);
        router.refresh();
      }
    } catch (err) {
      setError(err.message || "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  }

  function cancelChanges() {
    setForm(savedForm);
    setMessage("");
    setError("");
  }

  return (
    <>
      <section className="admin-panel team-editor-panel">
        <div className="admin-form-grid">
          <label>
            <span>Name</span>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Full name"
            />
          </label>

          <label>
            <span>Role</span>
            <input
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              placeholder="Role / discipline"
            />
          </label>

          <label>
            <span>Profile photo URL</span>
            <input
              value={form.photo_url}
              onChange={(e) => update("photo_url", e.target.value)}
              placeholder="https://..."
              type="url"
            />
          </label>

          <label>
            <span>Display order</span>
            <input
              value={form.display_order}
              onChange={(e) => update("display_order", e.target.value)}
              min="1"
              type="number"
            />
          </label>

          <label>
            <span>Status</span>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>

          <label className="admin-full-field">
            <span>Short bio</span>
            <textarea
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              rows="4"
            />
          </label>

          <label className="admin-full-field">
            <span>Expertise</span>
            <input
              value={form.expertise}
              onChange={(e) => update("expertise", e.target.value)}
              placeholder="Creative Direction, Brand Strategy, ..."
            />
          </label>

          <label className="admin-full-field">
            <span>Social / portfolio link</span>
            <input
              value={form.social_url}
              onChange={(e) => update("social_url", e.target.value)}
              placeholder="https://..."
              type="url"
            />
          </label>
        </div>
      </section>

      <div className="team-save-bar">
        <div className="team-save-status">
          {error ? <span className="save-error">{error}</span> : null}
          {!error && message ? <span className="save-success">{message}</span> : null}
          {!error && !message && dirty ? <span>Unsaved changes</span> : null}
          {!error && !message && !dirty ? <span>All changes saved</span> : null}
        </div>

        <div className="team-save-actions">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={cancelChanges}
            disabled={!dirty || saving}
          >
            Cancel
          </button>

          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={save}
            disabled={!dirty || saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .team-editor-panel {
          padding-bottom: 28px;
        }

        .team-editor-panel input,
        .team-editor-panel textarea,
        .team-editor-panel select {
          width: 100%;
          min-height: 44px;
          border: 1px solid #d8d4cd;
          border-radius: 10px;
          padding: 10px 12px;
          background: #fff;
          font: inherit;
          color: inherit;
          outline: none;
        }

        .team-editor-panel textarea {
          min-height: 110px;
          resize: vertical;
        }

        .team-editor-panel input:focus,
        .team-editor-panel textarea:focus,
        .team-editor-panel select:focus {
          border-color: #111;
          box-shadow: 0 0 0 3px rgba(0,0,0,.04);
        }

        .team-save-bar {
          position: sticky;
          bottom: 0;
          z-index: 20;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-top: 18px;
          padding: 14px 16px;
          border: 1px solid #d8d4cd;
          border-radius: 14px;
          background: rgba(247,247,244,.96);
          backdrop-filter: blur(12px);
          box-shadow: 0 -8px 30px rgba(0,0,0,.04);
        }

        .team-save-status {
          color: #77726b;
          font-size: 12px;
        }

        .save-success {
          color: #2f6b39;
          font-weight: 700;
        }

        .save-error {
          color: #a02d22;
          font-weight: 700;
        }

        .team-save-actions {
          display: flex;
          gap: 10px;
        }

        .team-save-actions button:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        @media (max-width: 700px) {
          .team-save-bar {
            margin-left: -8px;
            margin-right: -8px;
            bottom: 8px;
            align-items: stretch;
            flex-direction: column;
          }

          .team-save-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .team-save-actions .admin-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
