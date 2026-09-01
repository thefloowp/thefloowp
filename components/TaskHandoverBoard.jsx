"use client";

import { useMemo, useState } from "react";

const STATUS_OPTIONS = [
  "Accepted",
  "In Progress",
  "For Review",
  "Blocked",
  "Done",
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
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Normal",
    due_date: "",
  });

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
      if (!response.ok) throw new Error(data?.error || "Unable to create project.");

      setItems((current) => [data.item, ...current]);
      setForm({ title: "", description: "", priority: "Normal", due_date: "" });
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
      if (!response.ok) throw new Error(data?.error || "Unable to update project.");

      setItems((current) =>
        current.map((item) => (item.id === id ? data.item : item))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId("");
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
    patchItem(item.id, { assignee: null, status: "Open" });
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
          <button className="primary-button" onClick={() => setShowCreate(true)}>
            + New Open Project
          </button>
        </div>

        {showCreate ? (
          <form className="new-project-form" onSubmit={createProject}>
            <div className="form-grid">
              <label className="form-wide">
                <span>Project name</span>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, title: e.target.value }))
                  }
                  required
                />
              </label>

              <label className="form-wide">
                <span>Short description</span>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      description: e.target.value,
                    }))
                  }
                />
              </label>

              <label>
                <span>Priority</span>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, priority: e.target.value }))
                  }
                >
                  <option>Low</option>
                  <option>Normal</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </label>

              <label>
                <span>Due date</span>
                <input
                  type="date"
                  value={form.due_date}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, due_date: e.target.value }))
                  }
                />
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
              <button type="submit" className="primary-button">
                Add to Open Projects
              </button>
            </div>
          </form>
        ) : null}

        <div className="open-project-list">
          {openProjects.length === 0 ? (
            <div className="empty-state">
              No open projects right now. New projects will stay here until somebody accepts them.
            </div>
          ) : (
            openProjects.map((item) => (
              <article className="open-project-card" key={item.id}>
                <div className="project-main">
                  <div className="project-topline">
                    <span className={`priority ${item.priority?.toLowerCase()}`}>
                      {item.priority || "Normal"}
                    </span>
                    <span className="status-pill">Open</span>
                  </div>
                  <h3>{item.title}</h3>
                  {item.description ? <p>{item.description}</p> : null}
                  <div className="project-meta">
                    {item.due_date ? `Due ${formatDate(item.due_date)}` : "No due date"}
                  </div>
                </div>

                <div className="accept-area">
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
                    {group.items.length} project{group.items.length === 1 ? "" : "s"}
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
                              status: event.target.checked ? "Done" : "In Progress",
                            })
                          }
                        />
                        <span />
                      </label>

                      <div className="person-project-copy">
                        <strong>{item.title}</strong>
                        <small>
                          {item.due_date ? `Due ${formatDate(item.due_date)}` : "No due date"}
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
                          patchItem(item.id, { status: event.target.value })
                        }
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <button
                        className="text-button"
                        disabled={savingId === item.id}
                        onClick={() => returnToOpen(item)}
                      >
                        Return to Open
                      </button>
                    </div>
                  ))
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <style jsx>{`
        .handover-board { display: flex; flex-direction: column; gap: 28px; }
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
        h2 { margin: 0; font-size: 28px; letter-spacing: -0.035em; }
        .primary-button, .secondary-button, .text-button {
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
        .secondary-button {
          border: 1px solid #d7d2ca;
          border-radius: 999px;
          padding: 9px 14px;
          background: #fff;
        }
        .text-button {
          border: 0;
          padding: 0;
          background: transparent;
          text-decoration: underline;
          white-space: nowrap;
        }
        button:disabled, select:disabled { opacity: 0.5; cursor: wait; }
        .new-project-form {
          padding: 22px 24px;
          border-bottom: 1px solid #e4e0da;
          background: #faf9f7;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .form-wide { grid-column: 1 / -1; }
        label {
          display: flex;
          flex-direction: column;
          gap: 7px;
          font-size: 12px;
          font-weight: 700;
        }
        input, textarea, select {
          width: 100%;
          border: 1px solid #d8d4cd;
          border-radius: 9px;
          padding: 10px 11px;
          background: #fff;
          font: inherit;
          color: inherit;
          outline: none;
        }
        textarea { resize: vertical; }
        input:focus, textarea:focus, select:focus { border-color: #111; }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 18px;
        }
        .open-project-list, .person-list { padding: 0 24px; }
        .open-project-card {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 26px;
          align-items: center;
          padding: 22px 0;
          border-bottom: 1px solid #e5e1db;
        }
        .open-project-card:last-child, .person-block:last-child { border-bottom: 0; }
        .project-topline {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 9px;
        }
        .priority, .status-pill {
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
        .priority { background: #efede9; }
        .priority.high, .priority.urgent { background: #f6e7e3; }
        .status-pill { background: #e8f4e9; color: #266632; }
        .project-main h3 { margin: 0; font-size: 19px; }
        .project-main p {
          margin: 7px 0;
          max-width: 700px;
          color: #68635d;
          line-height: 1.45;
        }
        .project-meta { margin-top: 10px; color: #8a847d; font-size: 12px; }
        .accept-area {
          min-width: 180px;
          display: flex;
          flex-direction: column;
          gap: 8px;
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
        .person-heading h3 { margin: 0 0 3px; font-size: 17px; }
        .person-heading span { color: #8a847d; font-size: 12px; }
        .person-projects {
          margin-left: 50px;
          border-top: 1px solid #e6e2dc;
        }
        .person-project-row {
          min-height: 58px;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) 150px auto;
          gap: 14px;
          align-items: center;
          border-bottom: 1px solid #e6e2dc;
        }
        .person-project-row:last-child { border-bottom: 0; }
        .check-wrap { display: block; }
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
          gap: 3px;
        }
        .person-project-copy strong {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .person-project-copy small { color: #8a847d; }
        .person-empty, .empty-state { color: #918b83; font-size: 13px; }
        .person-empty { margin: 0; padding: 18px 0; }
        .empty-state { padding: 28px 0; }
        .handover-error {
          padding: 13px 15px;
          border: 1px solid #e3b6ad;
          background: #fff1ee;
          color: #8e2d20;
          border-radius: 10px;
          font-size: 13px;
        }
        @media (max-width: 850px) {
          .handover-section-heading { align-items: stretch; flex-direction: column; }
          .open-project-card { grid-template-columns: 1fr; align-items: stretch; }
          .accept-area { min-width: 0; }
          .form-grid { grid-template-columns: 1fr; }
          .form-wide { grid-column: auto; }
          .person-projects { margin-left: 0; }
          .person-project-row {
            grid-template-columns: auto minmax(0, 1fr);
            padding: 12px 0;
          }
          .status-select, .text-button { grid-column: 2; }
        }
      `}</style>
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

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
