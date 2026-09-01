"use client";

import { useMemo, useState } from "react";

const STATUS_OPTIONS = [
  "Accepted",
  "In Progress",
  "For Review",
  "Blocked",
  "Done",
];

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

export default function TaskHandoverBoard({
  initialItems,
  teamMembers,
  loadError = "",
}) {
  const [items, setItems] = useState(initialItems || []);
  const [error, setError] = useState(loadError);
  const [savingId, setSavingId] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [acceptingId, setAcceptingId] = useState("");
  const [acceptAs, setAcceptAs] = useState(teamMembers?.[0] || "");
  const [editingId, setEditingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const blankForm = {
    title: "",
    description: "",
    work_type: "",
    priority: "Normal",
    start_date: todayISO(),
    due_date: "",
    turnaround_days: "",
    required_file_type: "",
    attachment_links: "",
    notes: "",
  };

  const [form, setForm] = useState(blankForm);
  const [editForm, setEditForm] = useState(blankForm);

  const openProjects = useMemo(
    () => items.filter((item) => !item.assignee || item.status === "Open"),
    [items]
  );

  const grouped = useMemo(
    () =>
      (teamMembers || []).map((name) => ({
        name,
        items: items.filter(
          (item) => item.assignee === name && item.status !== "Open"
        ),
      })),
    [items, teamMembers]
  );

  function updateForm(field, value, isEdit = false) {
    const setter = isEdit ? setEditForm : setForm;

    setter((current) => {
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
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditForm({
      title: item.title || "",
      description: item.description || "",
      work_type: item.work_type || "",
      priority: item.priority || "Normal",
      start_date: item.start_date || "",
      due_date: item.due_date || "",
      turnaround_days:
        item.turnaround_days === null || item.turnaround_days === undefined
          ? ""
          : String(item.turnaround_days),
      required_file_type: item.required_file_type || "",
      attachment_links: item.attachment_links || "",
      notes: item.notes || "",
    });
  }

  async function createProject(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to create project.");
      }

      setItems((current) => [data.item, ...current]);
      setForm(blankForm);
      setShowCreate(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function patchItem(id, updates) {
    setSavingId(id);
    setError("");

    try {
      const response = await fetch("/api/admin/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to update project.");
      }

      setItems((current) =>
        current.map((item) => (item.id === id ? data.item : item))
      );

      return data.item;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setSavingId("");
    }
  }

  async function saveEdit(id) {
    const updated = await patchItem(id, editForm);

    if (updated) {
      setEditingId("");
      setEditForm(blankForm);
    }
  }

  async function deleteProject(id) {
    setDeletingId(id);
    setError("");

    try {
      const response = await fetch("/api/admin/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to delete project.");
      }

      setItems((current) => current.filter((item) => item.id !== id));
      setEditingId("");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId("");
    }
  }

  function acceptProject(item) {
    if (acceptingId !== item.id) {
      setAcceptingId(item.id);
      return;
    }

    if (!acceptAs) {
      setError("Choose a team member first.");
      return;
    }

    patchItem(item.id, {
      assignee: acceptAs,
      status: "Accepted",
    }).then(() => setAcceptingId(""));
  }

  function returnToOpen(item) {
    patchItem(item.id, {
      assignee: null,
      status: "Open",
    });
  }

  return (
    <div className="handover-board">
      {error ? <div className="handover-error">{error}</div> : null}

      <section className="handover-section">
        <div className="handover-section-heading">
          <div>
            <p className="handover-eyebrow">Available to accept</p>
            <h2>Open Projects</h2>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() => setShowCreate((current) => !current)}
          >
            {showCreate ? "Close" : "+ New Open Project"}
          </button>
        </div>

        {showCreate ? (
          <ProjectForm
            form={form}
            updateField={(field, value) => updateForm(field, value)}
            onSubmit={createProject}
            onCancel={() => setShowCreate(false)}
            submitLabel="Add to Open Projects"
          />
        ) : null}

        <div className="open-project-list">
          {openProjects.length === 0 ? (
            <div className="empty-state">
              No open projects right now. New projects will stay here until
              somebody accepts them.
            </div>
          ) : (
            openProjects.map((item) => (
              <article className="open-project-card" key={item.id}>
                {editingId === item.id ? (
                  <div className="edit-panel">
                    <ProjectForm
                      form={editForm}
                      updateField={(field, value) =>
                        updateForm(field, value, true)
                      }
                      onSubmit={(event) => {
                        event.preventDefault();
                        saveEdit(item.id);
                      }}
                      onCancel={() => setEditingId("")}
                      submitLabel={
                        savingId === item.id ? "Saving..." : "Save Changes"
                      }
                      disabled={savingId === item.id}
                    />
                  </div>
                ) : (
                  <>
                    <div className="project-main">
                      <div className="project-topline">
                        {item.work_type ? (
                          <span className="work-type">{item.work_type}</span>
                        ) : null}

                        <span
                          className={`priority ${String(
                            item.priority || "Normal"
                          ).toLowerCase()}`}
                        >
                          {item.priority || "Normal"}
                        </span>

                        <span className="status-pill">Open</span>
                      </div>

                      <h3>{item.title}</h3>

                      {item.description ? <p>{item.description}</p> : null}

                      <div className="detail-grid">
                        <Detail
                          label="Submission"
                          value={
                            item.due_date
                              ? formatDate(item.due_date)
                              : "No target date"
                          }
                        />

                        <Detail
                          label="Turnaround"
                          value={
                            item.turnaround_days !== null &&
                            item.turnaround_days !== undefined &&
                            item.turnaround_days !== ""
                              ? `${item.turnaround_days} day${
                                  Number(item.turnaround_days) === 1 ? "" : "s"
                                }`
                              : "Not set"
                          }
                        />

                        <Detail
                          label="File type"
                          value={item.required_file_type || "Not specified"}
                        />
                      </div>

                      {item.notes ? (
                        <div className="project-notes">
                          <strong>Notes</strong>
                          <span>{item.notes}</span>
                        </div>
                      ) : null}

                      {getLinks(item.attachment_links).length ? (
                        <div className="attachment-list">
                          <strong>Attachments / References</strong>
                          <div>
                            {getLinks(item.attachment_links).map(
                              (link, index) => (
                                <a
                                  key={`${link}-${index}`}
                                  href={normalizeUrl(link)}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  Link {index + 1} ↗
                                </a>
                              )
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="accept-area">
                      <div className="project-actions">
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="danger-button"
                          disabled={deletingId === item.id}
                          onClick={() => deleteProject(item.id)}
                        >
                          {deletingId === item.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>

                      {acceptingId === item.id ? (
                        <select
                          value={acceptAs}
                          onChange={(event) => setAcceptAs(event.target.value)}
                        >
                          {(teamMembers || []).map((member) => (
                            <option key={member} value={member}>
                              {member}
                            </option>
                          ))}
                        </select>
                      ) : null}

                      <button
                        className="primary-button"
                        disabled={savingId === item.id}
                        onClick={() => acceptProject(item)}
                      >
                        {savingId === item.id
                          ? "Saving..."
                          : acceptingId === item.id
                          ? `Accept as ${acceptAs || "team member"}`
                          : "Accept Project"}
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))
          )}
        </div>
      </section>

      <section className="handover-section">
        <div className="handover-section-heading">
          <div>
            <p className="handover-eyebrow">Accepted work</p>
            <h2>By Person</h2>
          </div>
        </div>

        <div className="person-list">
          {grouped.map((group) => (
            <article className="person-block" key={group.name}>
              <div className="person-heading">
                <div className="person-avatar">{initialsFor(group.name)}</div>

                <div>
                  <h3>{group.name}</h3>
                  <span>
                    {group.items.length} project
                    {group.items.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              <div className="person-projects">
                {group.items.length === 0 ? (
                  <p className="person-empty">No accepted projects.</p>
                ) : (
                  group.items.map((item) => (
                    <div className="person-project-row" key={item.id}>
                      <label className="check-wrap">
                        <input
                          type="checkbox"
                          checked={item.status === "Done"}
                          onChange={(event) =>
                            patchItem(item.id, {
                              status: event.target.checked
                                ? "Done"
                                : "In Progress",
                            })
                          }
                        />
                        <span />
                      </label>

                      <div className="person-project-copy">
                        <strong>{item.title}</strong>
                        <small>
                          {item.due_date
                            ? `Submit ${formatDate(item.due_date)}`
                            : "No target date"}
                          {item.turnaround_days !== null &&
                          item.turnaround_days !== undefined &&
                          item.turnaround_days !== ""
                            ? ` • ${item.turnaround_days}d turnaround`
                            : ""}
                          {item.required_file_type
                            ? ` • ${item.required_file_type}`
                            : ""}
                        </small>
                      </div>

                      <select
                        className="status-select"
                        value={
                          STATUS_OPTIONS.includes(item.status)
                            ? item.status
                            : "Accepted"
                        }
                        disabled={savingId === item.id}
                        onChange={(event) =>
                          patchItem(item.id, {
                            status: event.target.value,
                          })
                        }
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <div className="row-actions">
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="text-button danger-text"
                          disabled={deletingId === item.id}
                          onClick={() => deleteProject(item.id)}
                        >
                          {deletingId === item.id ? "Deleting..." : "Delete"}
                        </button>

                        <button
                          type="button"
                          className="text-button"
                          disabled={savingId === item.id}
                          onClick={() => returnToOpen(item)}
                        >
                          Return to Open
                        </button>
                      </div>

                      {editingId === item.id ? (
                        <div className="person-edit-panel">
                          <ProjectForm
                            form={editForm}
                            updateField={(field, value) =>
                              updateForm(field, value, true)
                            }
                            onSubmit={(event) => {
                              event.preventDefault();
                              saveEdit(item.id);
                            }}
                            onCancel={() => setEditingId("")}
                            submitLabel={
                              savingId === item.id ? "Saving..." : "Save Changes"
                            }
                            disabled={savingId === item.id}
                          />
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <style jsx global>{`
        .handover-board {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .handover-section {
          background: #fff;
          border: 1px solid #ddd9d2;
          border-radius: 16px;
          overflow: hidden;
        }

        .handover-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          padding: 24px;
          border-bottom: 1px solid #e4e0da;
        }

        .handover-eyebrow {
          margin: 0 0 5px;
          color: #77726b;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        h2 {
          margin: 0;
          font-size: 28px;
          letter-spacing: -0.035em;
        }

        .primary-button,
        .secondary-button,
        .danger-button,
        .text-button {
          font: inherit;
          cursor: pointer;
        }

        .primary-button {
          border: 0;
          border-radius: 999px;
          padding: 10px 15px;
          background: #090909;
          color: #fff;
          font-weight: 700;
          white-space: nowrap;
        }

        .secondary-button,
        .danger-button {
          border: 1px solid #d7d2ca;
          border-radius: 999px;
          padding: 9px 14px;
          background: #fff;
        }

        .danger-button {
          border-color: #e2b8b2;
          color: #9d2d24;
        }

        .text-button {
          border: 0;
          padding: 0;
          background: transparent;
          text-decoration: underline;
          white-space: nowrap;
        }

        .danger-text {
          color: #9d2d24;
        }

        button:disabled,
        select:disabled {
          opacity: 0.5;
          cursor: wait;
        }

        .new-project-form,
        .edit-panel,
        .person-edit-panel {
          padding: 24px;
          background: #faf9f7;
        }

        .new-project-form {
          border-bottom: 1px solid #e4e0da;
        }

        .edit-panel {
          grid-column: 1 / -1;
          width: 100%;
          border: 1px solid #ded9d1;
          border-radius: 14px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.035);
        }

        .person-edit-panel {
          grid-column: 1 / -1;
          margin: 10px 0 4px;
          border: 1px solid #e2ddd6;
          border-radius: 12px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px 18px;
        }

        .form-wide {
          grid-column: 1 / -1;
        }

        .new-project-form label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
          font-size: 12px;
          font-weight: 700;
          color: #26231f;
        }

        .new-project-form label small {
          color: #8a847d;
          font-size: 11px;
          font-weight: 400;
          line-height: 1.4;
        }

        .new-project-form input,
        .new-project-form textarea,
        .new-project-form select,
        .accept-area select,
        .status-select {
          width: 100%;
          min-height: 42px;
          border: 1px solid #d8d4cd;
          border-radius: 10px;
          padding: 10px 12px;
          background: #fff;
          font: inherit;
          color: inherit;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .new-project-form textarea {
          min-height: 92px;
        }

        .new-project-form input:focus,
        .new-project-form textarea:focus,
        .new-project-form select:focus,
        .accept-area select:focus,
        .status-select:focus {
          border-color: #111;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.045);
        }

        .new-project-form textarea {
          resize: vertical;
        }

        .input-with-suffix {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          border: 1px solid #d8d4cd;
          border-radius: 9px;
          background: #fff;
          overflow: hidden;
        }

        .input-with-suffix input {
          border: 0;
          border-radius: 0;
        }

        .input-with-suffix span {
          padding: 0 12px;
          color: #77726b;
          font-size: 12px;
          font-weight: 400;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .open-project-list,
        .person-list {
          padding: 0 24px;
        }

        .open-project-card {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 28px;
          align-items: start;
          padding: 24px 0;
          border-bottom: 1px solid #e5e1db;
        }

        .open-project-card:last-child,
        .person-block:last-child {
          border-bottom: 0;
        }

        .project-topline {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin-bottom: 9px;
        }

        .priority,
        .status-pill,
        .work-type {
          display: inline-flex;
          align-items: center;
          min-height: 23px;
          border-radius: 999px;
          padding: 0 9px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .work-type {
          background: #ecebf8;
          color: #4c4779;
        }

        .priority {
          background: #efede9;
        }

        .priority.high,
        .priority.urgent {
          background: #f6e7e3;
        }

        .status-pill {
          background: #e8f4e9;
          color: #266632;
        }

        .project-main h3 {
          margin: 0;
          font-size: 19px;
        }

        .project-main > p {
          margin: 7px 0 15px;
          max-width: 760px;
          color: #68635d;
          line-height: 1.45;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          max-width: 720px;
          margin-top: 14px;
        }

        :global(.project-detail) {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 10px 12px;
          border: 1px solid #ebe7e1;
          border-radius: 9px;
          background: #faf9f7;
        }

        :global(.project-detail-label) {
          color: #908980;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        :global(.project-detail-value) {
          font-size: 12px;
          line-height: 1.35;
        }

        .project-notes,
        .attachment-list {
          max-width: 720px;
          margin-top: 13px;
          padding-top: 12px;
          border-top: 1px solid #ebe7e1;
          font-size: 12px;
        }

        .project-notes {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .project-notes span {
          color: #68635d;
          line-height: 1.45;
          white-space: pre-wrap;
        }

        .attachment-list > div {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 7px;
        }

        .attachment-list a {
          display: inline-flex;
          border: 1px solid #dcd7cf;
          border-radius: 999px;
          padding: 6px 9px;
          font-size: 11px;
        }

        .accept-area {
          min-width: 210px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .project-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          flex-wrap: wrap;
        }

        .person-block {
          padding: 24px 0;
          border-bottom: 1px solid #e5e1db;
        }

        .person-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .person-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #111;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
        }

        .person-heading h3 {
          margin: 0 0 3px;
          font-size: 17px;
        }

        .person-heading span {
          color: #8a847d;
          font-size: 12px;
        }

        .person-projects {
          margin-left: 50px;
          border-top: 1px solid #e6e2dc;
        }

        .person-project-row {
          min-height: 62px;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) 150px auto;
          gap: 14px;
          align-items: center;
          border-bottom: 1px solid #e6e2dc;
        }

        .person-project-row:last-child {
          border-bottom: 0;
        }

        .row-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: flex-end;
          align-items: center;
        }

        .check-wrap {
          display: block;
        }

        .check-wrap input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .check-wrap span {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 1px solid #aaa49c;
          display: block;
          position: relative;
          cursor: pointer;
        }

        .check-wrap input:checked + span {
          background: #111;
          border-color: #111;
        }

        .check-wrap input:checked + span::after {
          content: "✓";
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          color: #fff;
          font-size: 12px;
        }

        .person-project-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .person-project-copy strong {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .person-project-copy small {
          color: #8a847d;
          line-height: 1.35;
        }

        .person-empty,
        .empty-state {
          color: #918b83;
          font-size: 13px;
        }

        .person-empty {
          margin: 0;
          padding: 18px 0;
        }

        .empty-state {
          padding: 28px 0;
        }

        .handover-error {
          padding: 13px 15px;
          border: 1px solid #e3b6ad;
          background: #fff1ee;
          color: #8e2d20;
          border-radius: 10px;
          font-size: 13px;
        }

        @media (max-width: 900px) {
          .handover-section-heading {
            align-items: stretch;
            flex-direction: column;
          }

          .open-project-card {
            grid-template-columns: 1fr;
          }

          .accept-area {
            min-width: 0;
          }

          .form-grid,
          .detail-grid {
            grid-template-columns: 1fr;
          }

          .form-wide {
            grid-column: auto;
          }

          .person-projects {
            margin-left: 0;
          }

          .person-project-row {
            grid-template-columns: auto minmax(0, 1fr);
            padding: 12px 0;
          }

          .status-select,
          .row-actions,
          .person-edit-panel {
            grid-column: 2;
          }

          .row-actions {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

function ProjectForm({
  form,
  updateField,
  onSubmit,
  onCancel,
  submitLabel,
  disabled = false,
}) {
  return (
    <form className="new-project-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label className="form-wide">
          <span>Project name *</span>
          <input
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            required
          />
        </label>

        <label className="form-wide">
          <span>Project brief / description *</span>
          <textarea
            rows="4"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            required
          />
        </label>

        <label>
          <span>Type of work</span>
          <select
            value={form.work_type}
            onChange={(e) => updateField("work_type", e.target.value)}
          >
            <option value="">Select type</option>
            {WORK_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Priority</span>
          <select
            value={form.priority}
            onChange={(e) => updateField("priority", e.target.value)}
          >
            <option>Low</option>
            <option>Normal</option>
            <option>High</option>
            <option>Urgent</option>
          </select>
        </label>

        <label>
          <span>Start / request date</span>
          <input
            type="date"
            value={form.start_date}
            onChange={(e) => updateField("start_date", e.target.value)}
          />
        </label>

        <label>
          <span>Target / submission date *</span>
          <input
            type="date"
            value={form.due_date}
            onChange={(e) => updateField("due_date", e.target.value)}
            required
          />
        </label>

        <label>
          <span>Turnaround</span>
          <div className="input-with-suffix">
            <input
              type="number"
              min="0"
              value={form.turnaround_days}
              onChange={(e) => updateField("turnaround_days", e.target.value)}
            />
            <span>days</span>
          </div>
        </label>

        <label>
          <span>Required file type(s)</span>
          <input
            value={form.required_file_type}
            onChange={(e) =>
              updateField("required_file_type", e.target.value)
            }
          />
        </label>

        <label className="form-wide">
          <span>Attachments / reference links</span>
          <textarea
            rows="3"
            value={form.attachment_links}
            onChange={(e) =>
              updateField("attachment_links", e.target.value)
            }
          />
        </label>

        <label className="form-wide">
          <span>Special instructions / notes</span>
          <textarea
            rows="3"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
          />
        </label>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
          disabled={disabled}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-button"
          disabled={disabled}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Detail({ label, value }) {
  return (
    <div className="project-detail">
      <span className="project-detail-label">{label}</span>
      <span className="project-detail-value">{value}</span>
    </div>
  );
}

function initialsFor(name) {
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function todayISO() {
  const date = new Date();
  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function daysBetween(start, end) {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  const diff = Math.ceil((endDate - startDate) / 86400000);
  return Math.max(0, diff);
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getLinks(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeUrl(value) {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}
