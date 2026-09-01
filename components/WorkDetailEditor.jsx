"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const WORK_TYPES = [
  "Branding",
  "Graphic Design",
  "Social Media",
  "Video",
  "Web / UI",
  "Copywriting",
  "Presentation",
  "E-commerce",
  "Other",
];

export default function WorkDetailEditor({ initialItem, teamOptions = [] }) {
  const router = useRouter();

  const initialForm = useMemo(
    () => ({
      title: initialItem?.title || "",
      description: initialItem?.description || "",
      work_type: initialItem?.work_type || "",
      priority: initialItem?.priority || "Normal",
      start_date: initialItem?.start_date || "",
      due_date: initialItem?.due_date || "",
      turnaround_days:
        initialItem?.turnaround_days === null ||
        initialItem?.turnaround_days === undefined
          ? ""
          : String(initialItem.turnaround_days),
      required_file_type: initialItem?.required_file_type || "",
      work_from: Array.isArray(initialItem?.work_from)
        ? initialItem.work_from
        : [],
      rate_currency: initialItem?.rate_currency || "PHP",
      rate_amount:
        initialItem?.rate_amount === null ||
        initialItem?.rate_amount === undefined
          ? ""
          : String(initialItem.rate_amount),
      attachment_links: initialItem?.attachment_links || "",
      notes: initialItem?.notes || "",
    }),
    [initialItem]
  );

  const [form, setForm] = useState(initialForm);
  const [savedForm, setSavedForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const dirty = JSON.stringify(form) !== JSON.stringify(savedForm);

  function update(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (field === "start_date" || field === "due_date") {
        const start = field === "start_date" ? value : next.start_date;
        const due = field === "due_date" ? value : next.due_date;

        if (start && due) {
          next.turnaround_days = String(daysBetween(start, due));
        }
      }

      return next;
    });

    setError("");
  }

  async function saveChanges() {
    if (!dirty || saving) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: initialItem.id,
          ...form,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to save changes.");
      }

      setSavedForm(form);
      router.replace(`/admin/tasks/${initialItem.id}`);
      router.refresh();
    } catch (err) {
      setError(err.message || "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    if (dirty) {
      const leave = window.confirm("Discard your unsaved changes?");
      if (!leave) return;
    }

    router.replace(`/admin/tasks/${initialItem.id}`);
  }

  return (
    <section className="work-edit-card">
      <div className="work-edit-section">
        <div className="work-edit-section-heading">
          <p>Work Information</p>
          <span>Core client request and delivery details.</span>
        </div>

        <div className="work-edit-grid">
          <Field label="Project / work title" full>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              required
            />
          </Field>

          <Field label="Client Brief" full>
            <textarea
              rows="7"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </Field>

          <Field label="Type of work">
            <select
              value={form.work_type}
              onChange={(e) => update("work_type", e.target.value)}
            >
              <option value="">Select type</option>
              {WORK_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </Field>

          <Field label="Priority">
            <select
              value={form.priority}
              onChange={(e) => update("priority", e.target.value)}
            >
              <option>Low</option>
              <option>Normal</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </Field>

          <Field label="Request Date">
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => update("start_date", e.target.value)}
            />
          </Field>

          <Field label="Delivery Deadline">
            <input
              type="date"
              value={form.due_date}
              onChange={(e) => update("due_date", e.target.value)}
            />
          </Field>

          <Field label="Turnaround Time">
            <div className="field-suffix">
              <input
                type="number"
                min="0"
                value={form.turnaround_days}
                onChange={(e) => update("turnaround_days", e.target.value)}
              />
              <span>days</span>
            </div>
          </Field>

          <div className="work-edit-field full">
            <div className="deliverable-editor-heading">
              <div>
                <span className="deliverable-editor-label">
                  Required Deliverables
                </span>
                <small>
                  Add each requested output separately with its format,
                  dimensions or ratio, quantity, and notes.
                </small>
              </div>

              <button
                type="button"
                className="small-action"
                onClick={() => addDeliverable(form, update)}
              >
                + Add Deliverable
              </button>
            </div>

            <DeliverableEditor
              value={form.required_file_type}
              onChange={(value) => update("required_file_type", value)}
            />
          </div>

          <div className="work-edit-field full">
            <span>Work From</span>
            <small className="field-help">
              Choose one or more preferred team members for this work.
            </small>

            <TeamMultiSelect
              options={teamOptions}
              value={form.work_from}
              onChange={(value) => update("work_from", value)}
            />
          </div>

          <Field label="Rate Currency">
            <select
              value={form.rate_currency}
              onChange={(e) => update("rate_currency", e.target.value)}
            >
              <option value="PHP">PHP (₱)</option>
              <option value="USD">USD ($)</option>
            </select>
          </Field>

          <Field label="Project Rate">
            <div className="field-prefix">
              <span>{form.rate_currency === "USD" ? "$" : "₱"}</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.rate_amount}
                onChange={(e) => update("rate_amount", e.target.value)}
                placeholder="0.00"
              />
            </div>
          </Field>
        </div>
      </div>

      <div className="work-edit-section">
        <div className="attachment-heading">
          <div className="work-edit-section-heading">
            <p>Client Files & References</p>
            <span>
              Add named links or image references. Add as many as needed.
            </span>
          </div>

          <div className="attachment-actions">
            <button
              type="button"
              className="small-action"
              onClick={() => addAttachment(form, update, "link")}
            >
              + Link
            </button>
            <button
              type="button"
              className="small-action"
              onClick={() => addAttachment(form, update, "image")}
            >
              + Image
            </button>
          </div>
        </div>

        <AttachmentEditor
          value={form.attachment_links}
          onChange={(value) => update("attachment_links", value)}
        />
      </div>

      <div className="work-edit-section">
        <div className="work-edit-section-heading">
          <p>Requirements & Notes</p>
          <span>Additional instructions, messaging, dimensions, or approvals.</span>
        </div>

        <textarea
          className="notes-field"
          rows="8"
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
      </div>

      <div className="work-edit-savebar">
        <div className="save-state">
          {error ? (
            <span className="save-error">{error}</span>
          ) : dirty ? (
            <span>Unsaved changes</span>
          ) : (
            <span>All changes saved</span>
          )}
        </div>

        <div className="save-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={cancel}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="button"
            className="save-button"
            onClick={saveChanges}
            disabled={!dirty || saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .work-edit-card {
          border: 1px solid #ddd9d2;
          border-radius: 16px;
          background: #fff;
          overflow: hidden;
        }

        .work-edit-section {
          padding: 26px;
          border-bottom: 1px solid #e5e1db;
        }

        .work-edit-section-heading {
          margin-bottom: 18px;
        }

        .work-edit-section-heading p {
          margin: 0 0 4px;
          font-size: 15px;
          font-weight: 800;
        }

        .work-edit-section-heading span {
          color: #817b73;
          font-size: 12px;
          line-height: 1.4;
        }

        .work-edit-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .work-edit-field {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .work-edit-field.full {
          grid-column: 1 / -1;
        }

        .work-edit-field > span {
          font-size: 12px;
          font-weight: 700;
        }

        .work-edit-card input,
        .work-edit-card textarea,
        .work-edit-card select {
          width: 100%;
          min-height: 44px;
          border: 1px solid #d8d4cd;
          border-radius: 10px;
          padding: 10px 12px;
          background: #fff;
          color: #191817;
          font: inherit;
          outline: none;
        }

        .work-edit-card textarea {
          resize: vertical;
          line-height: 1.5;
        }

        .work-edit-card input:focus,
        .work-edit-card textarea:focus,
        .work-edit-card select:focus {
          border-color: #111;
          box-shadow: 0 0 0 3px rgba(0,0,0,.045);
        }

        .field-prefix,
        .field-suffix {
          display: grid;
          align-items: center;
          border: 1px solid #d8d4cd;
          border-radius: 10px;
          overflow: hidden;
        }

        .field-prefix {
          grid-template-columns: auto minmax(0, 1fr);
        }

        .field-suffix {
          grid-template-columns: minmax(0, 1fr) auto;
        }

        .field-prefix input,
        .field-suffix input {
          border: 0;
          border-radius: 0;
          box-shadow: none !important;
        }

        .field-prefix span,
        .field-suffix span {
          padding: 0 12px;
          color: #817b73;
          font-size: 12px;
        }

        .field-help {
          color: #817b73;
          font-size: 11px;
          line-height: 1.4;
          font-weight: 400;
        }

        .deliverable-editor-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 12px;
        }

        .deliverable-editor-heading > div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .deliverable-editor-label {
          font-size: 12px;
          font-weight: 700;
        }

        .deliverable-editor-heading small {
          color: #817b73;
          font-size: 11px;
          line-height: 1.4;
        }

        .deliverable-edit-list {
          display: grid;
          gap: 10px;
        }

        .deliverable-edit-row {
          padding: 13px;
          border: 1px solid #e0dbd4;
          border-radius: 12px;
          background: #faf9f7;
        }

        .deliverable-edit-row-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .deliverable-edit-row-top strong {
          font-size: 11px;
          letter-spacing: .05em;
          text-transform: uppercase;
        }

        .deliverable-edit-grid {
          display: grid;
          grid-template-columns: 1.25fr 1fr 1fr .65fr;
          gap: 10px;
        }

        .deliverable-edit-grid label {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .deliverable-edit-grid label > span {
          font-size: 11px;
          font-weight: 700;
        }

        .deliverable-edit-notes {
          grid-column: 1 / -1;
        }

        .deliverable-empty-edit {
          padding: 18px;
          border: 1px dashed #d8d4cd;
          border-radius: 12px;
          background: #faf9f7;
          color: #817b73;
          font-size: 12px;
          text-align: center;
        }

        .team-multi-select {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .team-choice {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 38px;
          padding: 0 12px;
          border: 1px solid #d8d4cd;
          border-radius: 999px;
          background: #fff;
          color: #38342f;
          font: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .team-choice.is-selected {
          border-color: #111;
          background: #111;
          color: #fff;
        }

        .team-choice-mark {
          width: 16px;
          height: 16px;
          display: grid;
          place-items: center;
          border: 1px solid currentColor;
          border-radius: 50%;
          font-size: 10px;
        }

        .attachment-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
        }

        .attachment-actions {
          display: flex;
          gap: 8px;
        }

        .small-action {
          min-height: 38px;
          padding: 0 14px;
          border: 1px solid #d8d4cd;
          border-radius: 999px;
          background: #fff;
          color: #111;
          font: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .attachment-edit-list {
          display: grid;
          gap: 10px;
        }

        .attachment-edit-row {
          display: grid;
          grid-template-columns: auto minmax(0, .8fr) minmax(0, 1.2fr) auto;
          gap: 10px;
          align-items: end;
          padding: 13px;
          border: 1px solid #e0dbd4;
          border-radius: 12px;
          background: #faf9f7;
        }

        .attachment-type {
          min-width: 74px;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 10px;
          border-radius: 9px;
          background: #eeece8;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .05em;
        }

        .attachment-edit-row label {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .attachment-edit-row label > span {
          font-size: 11px;
          font-weight: 700;
        }

        .remove-attachment {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border: 1px solid #e6c7c1;
          border-radius: 9px;
          background: #fffafa;
          color: #9d2d24;
          font: inherit;
          cursor: pointer;
        }

        .attachment-empty-edit {
          padding: 18px;
          border: 1px dashed #d8d4cd;
          border-radius: 12px;
          background: #faf9f7;
          color: #817b73;
          font-size: 12px;
          text-align: center;
        }

        .notes-field {
          min-height: 180px;
        }

        .work-edit-savebar {
          position: sticky;
          bottom: 0;
          z-index: 15;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 18px;
          background: rgba(250,249,247,.96);
          backdrop-filter: blur(12px);
          border-top: 1px solid #ddd9d2;
        }

        .save-state {
          color: #817b73;
          font-size: 12px;
        }

        .save-error {
          color: #9d2d24;
          font-weight: 700;
        }

        .save-actions {
          display: flex;
          gap: 10px;
        }

        .cancel-button,
        .save-button {
          min-height: 42px;
          padding: 0 17px;
          border-radius: 999px;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }

        .cancel-button {
          border: 1px solid #d8d4cd;
          background: #fff;
        }

        .save-button {
          border: 1px solid #111;
          background: #111;
          color: #fff;
        }

        .save-button:disabled {
          opacity: .4;
          cursor: not-allowed;
        }

        @media (max-width: 760px) {
          .work-edit-section {
            padding: 20px 18px;
          }

          .work-edit-grid {
            grid-template-columns: 1fr;
          }

          .work-edit-field.full {
            grid-column: auto;
          }

          .deliverable-editor-heading,
          .attachment-heading {
            flex-direction: column;
          }

          .deliverable-editor-heading .small-action {
            width: 100%;
          }

          .deliverable-edit-grid {
            grid-template-columns: 1fr;
          }

          .deliverable-edit-notes {
            grid-column: auto;
          }

          .attachment-actions {
            width: 100%;
          }

          .small-action {
            flex: 1 1 0;
          }

          .attachment-edit-row {
            grid-template-columns: 1fr;
          }

          .attachment-type {
            justify-self: flex-start;
          }

          .remove-attachment {
            width: 100%;
          }

          .work-edit-savebar {
            align-items: stretch;
            flex-direction: column;
            padding: 12px;
          }

          .save-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            width: 100%;
          }

          .cancel-button,
          .save-button {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

function Field({ label, full = false, children }) {
  return (
    <label className={`work-edit-field ${full ? "full" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function DeliverableEditor({ value, onChange }) {
  const items = parseDeliverables(value);

  if (!items.length) {
    return (
      <div className="deliverable-empty-edit">
        No deliverables added yet.
      </div>
    );
  }

  function updateItem(index, field, nextValue) {
    onChange(
      JSON.stringify(
        items.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: nextValue } : item
        )
      )
    );
  }

  function removeItem(index) {
    onChange(
      JSON.stringify(items.filter((_, itemIndex) => itemIndex !== index))
    );
  }

  return (
    <div className="deliverable-edit-list">
      {items.map((item, index) => (
        <div className="deliverable-edit-row" key={item.id || index}>
          <div className="deliverable-edit-row-top">
            <strong>Deliverable {index + 1}</strong>
            <button
              type="button"
              className="remove-attachment"
              onClick={() => removeItem(index)}
            >
              Remove
            </button>
          </div>

          <div className="deliverable-edit-grid">
            <label>
              <span>File / output type</span>
              <input
                value={item.name || ""}
                onChange={(e) => updateItem(index, "name", e.target.value)}
                placeholder="e.g. Social Media Key Visual"
              />
            </label>

            <label>
              <span>Format</span>
              <input
                value={item.format || ""}
                onChange={(e) => updateItem(index, "format", e.target.value)}
                placeholder="e.g. PNG, MP4"
              />
            </label>

            <label>
              <span>Ratio / dimensions</span>
              <input
                value={item.ratio || ""}
                onChange={(e) => updateItem(index, "ratio", e.target.value)}
                placeholder="e.g. 9:16 or 1080×1920"
              />
            </label>

            <label>
              <span>Quantity</span>
              <input
                type="number"
                min="1"
                value={item.quantity || "1"}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
              />
            </label>

            <label className="deliverable-edit-notes">
              <span>Deliverable notes</span>
              <input
                value={item.notes || ""}
                onChange={(e) => updateItem(index, "notes", e.target.value)}
                placeholder="e.g. Editable source file also required"
              />
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamMultiSelect({ options, value, onChange }) {
  const selected = Array.isArray(value) ? value : [];

  function toggle(slug) {
    onChange(
      selected.includes(slug)
        ? selected.filter((item) => item !== slug)
        : [...selected, slug]
    );
  }

  return (
    <div className="team-multi-select">
      {options.map((member) => {
        const active = selected.includes(member.slug);

        return (
          <button
            key={member.slug}
            type="button"
            className={`team-choice ${active ? "is-selected" : ""}`}
            onClick={() => toggle(member.slug)}
            aria-pressed={active}
          >
            <span className="team-choice-mark">{active ? "✓" : ""}</span>
            <span>{member.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function addDeliverable(form, update) {
  const items = parseDeliverables(form.required_file_type);

  items.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: "",
    format: "",
    ratio: "",
    quantity: "1",
    notes: "",
  });

  update("required_file_type", JSON.stringify(items));
}

function parseDeliverables(value) {
  const text = String(value || "").trim();
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed)) {
      return parsed.map((item, index) => ({
        id: item.id || `saved-deliverable-${index}`,
        name: String(item.name || ""),
        format: String(item.format || ""),
        ratio: String(item.ratio || ""),
        quantity: String(item.quantity || "1"),
        notes: String(item.notes || ""),
      }));
    }
  } catch {
    // Legacy text becomes one deliverable.
  }

  return [
    {
      id: "legacy-deliverable-0",
      name: "Primary Deliverable",
      format: text,
      ratio: "",
      quantity: "1",
      notes: "",
    },
  ];
}

function AttachmentEditor({ value, onChange }) {
  const items = parseAttachments(value);

  if (!items.length) {
    return (
      <div className="attachment-empty-edit">
        No client files or references added yet.
      </div>
    );
  }

  function updateItem(index, field, nextValue) {
    onChange(
      JSON.stringify(
        items.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: nextValue } : item
        )
      )
    );
  }

  function removeItem(index) {
    onChange(JSON.stringify(items.filter((_, itemIndex) => itemIndex !== index)));
  }

  return (
    <div className="attachment-edit-list">
      {items.map((item, index) => (
        <div className="attachment-edit-row" key={item.id || index}>
          <div className="attachment-type">
            {item.type === "image" ? "Image" : "Link"}
          </div>

          <label>
            <span>Title / name</span>
            <input
              value={item.title || ""}
              onChange={(e) => updateItem(index, "title", e.target.value)}
              placeholder="Reference title"
            />
          </label>

          <label>
            <span>{item.type === "image" ? "Image URL" : "Link URL"}</span>
            <input
              value={item.url || ""}
              onChange={(e) => updateItem(index, "url", e.target.value)}
              placeholder="https://..."
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </label>

          <button
            type="button"
            className="remove-attachment"
            onClick={() => removeItem(index)}
            aria-label="Remove attachment"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function addAttachment(form, update, type) {
  const items = parseAttachments(form.attachment_links);

  items.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    title: "",
    url: "",
  });

  update("attachment_links", JSON.stringify(items));
}

function parseAttachments(value) {
  const text = String(value || "").trim();
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed.map((item, index) => ({
        id: item.id || `saved-${index}`,
        type: item.type === "image" ? "image" : "link",
        title: String(item.title || ""),
        url: String(item.url || ""),
      }));
    }
  } catch {
    // Legacy values are handled below.
  }

  const urls =
    text.match(/https?:\/\/[^\s,]+/gi) ||
    text
      .split(/[\r\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);

  return urls.map((url, index) => ({
    id: `legacy-${index}`,
    type: "link",
    title: `Link ${index + 1}`,
    url,
  }));
}

function daysBetween(start, end) {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  const diff = Math.ceil((endDate - startDate) / 86400000);
  return Math.max(0, diff);
}
