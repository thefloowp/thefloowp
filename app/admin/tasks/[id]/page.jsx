import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import WorkDetailEditor from "@/components/WorkDetailEditor";
import { getTaskHandoverItems } from "@/lib/taskHandover";
import { getMergedTeamMembers } from "@/lib/teamDirectory";

export const dynamic = "force-dynamic";

export default async function WorkDetailPage({ params, searchParams }) {
  const { id } = await params;
  const query = await searchParams;
  const isEditing = query?.edit === "1";

  let item = null;
  let teamOptions = [];
  let loadError = "";

  try {
    const [items, members] = await Promise.all([
      getTaskHandoverItems(),
      getMergedTeamMembers(),
    ]);

    item = items.find((entry) => String(entry.id) === String(id)) || null;
    teamOptions = members.map((member) => ({
      slug: member.slug,
      name: member.name,
    }));
  } catch (error) {
    loadError = error?.message || "Unable to load this work item.";
  }

  if (loadError || !item) {
    return (
      <AdminShell
        title="Work Details"
        subtitle={loadError || "This work item could not be found."}
      >
        <section className="detail-state-card">
          <p>{loadError || "The requested work item is no longer available."}</p>
          <Link className="admin-btn admin-btn-secondary" href="/admin/tasks">
            ← Back to Work Intake
          </Link>
        </section>

        <style>{`
          .detail-state-card {
            padding: 22px;
            border: 1px solid #ddd9d2;
            border-radius: 14px;
            background: #fff;
          }
        `}</style>
      </AdminShell>
    );
  }

  if (isEditing) {
    return (
      <AdminShell
        title={`Edit ${item.title}`}
        subtitle="Update the complete client work record."
      >
        <div className="work-detail-toolbar">
          <Link
            className="admin-btn admin-btn-secondary"
            href={`/admin/tasks/${item.id}`}
          >
            ← Back to View
          </Link>
          <span className="work-detail-status">{item.status || "Unassigned"}</span>
        </div>

        <WorkDetailEditor initialItem={item} teamOptions={teamOptions} />

        <style>{toolbarStyles}</style>
      </AdminShell>
    );
  }

  const attachments = parseAttachmentItems(item.attachment_links);

  return (
    <AdminShell
      title={item.title || "Work Details"}
      subtitle="Client work details, requirements, files, ownership, and delivery information."
    >
      <div className="work-detail-toolbar">
        <Link className="admin-btn admin-btn-secondary" href="/admin/tasks">
          ← Back to Work Intake
        </Link>

        <div className="work-detail-actions">
          <span className="work-detail-status">{item.status || "Unassigned"}</span>
          <Link
            className="admin-btn admin-btn-primary"
            href={`/admin/tasks/${item.id}?edit=1`}
          >
            Edit Work
          </Link>
        </div>
      </div>

      <section className="work-detail-card">
        <div className="work-detail-header">
          <div>
            <p className="work-detail-eyebrow">Client Work</p>
            <h2>{item.title || "Untitled Work"}</h2>
          </div>

          <div className="work-detail-tags">
            {item.work_type ? <span>{item.work_type}</span> : null}
            <span>{item.priority || "Normal"}</span>
          </div>
        </div>

        <div className="work-detail-grid">
          <Detail label="Owner" value={item.assignee || "Unassigned"} />
          <Detail label="Request Date" value={safeFormatDate(item.start_date)} />
          <Detail
            label="Delivery Deadline"
            value={safeFormatDate(item.due_date)}
          />
          <Detail
            label="Turnaround"
            value={formatTurnaround(item.turnaround_days)}
          />
          <Detail
            label="Deliverables"
            value={formatDeliverableCount(item.required_file_type)}
          />

          <Detail
            label="Work From"
            value={formatWorkFrom(item.work_from, teamOptions)}
          />
          <Detail
            label="Rate"
            value={formatRate(item.rate_currency, item.rate_amount)}
          />
        </div>

        {parseDeliverables(item.required_file_type).length ? (
          <div className="work-detail-section">
            <p className="work-detail-label">Required Deliverables</p>

            <div className="deliverable-view-list">
              {parseDeliverables(item.required_file_type).map(
                (deliverable, index) => (
                  <div className="deliverable-view-row" key={index}>
                    <div className="deliverable-view-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="deliverable-view-main">
                      <strong>
                        {deliverable.name || `Deliverable ${index + 1}`}
                      </strong>

                      <div className="deliverable-view-meta">
                        {deliverable.media_type ? (
                          <span>
                            {deliverable.media_type === "video"
                              ? "Video"
                              : deliverable.media_type === "document"
                              ? "Document"
                              : "Image"}
                          </span>
                        ) : null}
                        {deliverable.format ? (
                          <span>{deliverable.format}</span>
                        ) : null}
                        {deliverable.ratio ? (
                          <span>{deliverable.ratio}</span>
                        ) : null}
                        {deliverable.duration ? (
                          <span>{deliverable.duration}</span>
                        ) : null}
                        {deliverable.quantity ? (
                          <span>Qty {deliverable.quantity}</span>
                        ) : null}
                      </div>

                      {deliverable.notes ? (
                        <small>{deliverable.notes}</small>
                      ) : null}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ) : null}

        <div className="work-detail-section">
          <p className="work-detail-label">Client Brief</p>
          <div className="work-detail-copy">
            {item.description || "No client brief provided."}
          </div>
        </div>

        {item.notes ? (
          <div className="work-detail-section">
            <p className="work-detail-label">Requirements & Notes</p>
            <div className="work-detail-copy">{item.notes}</div>
          </div>
        ) : null}

        <div className="work-detail-section">
          <p className="work-detail-label">Client Files & References</p>

          {attachments.length ? (
            <div className="work-link-list">
              {attachments.map((attachment, index) => (
                <a
                  key={`${attachment.url}-${index}`}
                  className="work-link-card"
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className={`work-resource-visual ${
                      attachment.type === "image" ? "is-image" : ""
                    }`}
                  >
                    {attachment.type === "image" ? (
                      <img
                        src={attachment.url}
                        alt={attachment.title || `Image ${index + 1}`}
                      />
                    ) : (
                      <ResourceLinkIcon />
                    )}
                  </div>

                  <span className="work-link-copy">
                    <span className="work-resource-type">
                      {attachment.type === "image" ? "Image" : "Link"}
                    </span>
                    <strong>
                      {attachment.title ||
                        (attachment.type === "image"
                          ? `Image ${index + 1}`
                          : `Link ${index + 1}`)}
                    </strong>
                    <small>{shortenLink(attachment.url)}</small>
                  </span>

                  <span className="work-link-open" aria-hidden="true">
                    <OpenIcon />
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="work-detail-empty">No client files or references.</p>
          )}
        </div>
      </section>

      <style>{`
        ${toolbarStyles}

        .work-detail-card {
          overflow: hidden;
          border: 1px solid #ddd9d2;
          border-radius: 16px;
          background: #fff;
        }

        .work-detail-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          padding: 26px;
          border-bottom: 1px solid #e5e1db;
        }

        .work-detail-eyebrow,
        .work-detail-label {
          margin: 0 0 8px;
          color: #7c766e;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .work-detail-header h2 {
          margin: 0;
          font-size: clamp(28px, 4vw, 48px);
          letter-spacing: -.04em;
        }

        .work-detail-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: flex-end;
        }

        .work-detail-tags span {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 0 10px;
          border-radius: 999px;
          background: #f1efeb;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .work-detail-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1px;
          background: #e5e1db;
          border-bottom: 1px solid #e5e1db;
        }

        .work-detail-cell {
          min-width: 0;
          padding: 20px 22px;
          background: #fff;
        }

        .work-detail-cell span {
          display: block;
          margin-bottom: 6px;
          color: #8b857d;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .work-detail-cell strong {
          display: block;
          overflow-wrap: anywhere;
          font-size: 14px;
        }

        .work-detail-section {
          padding: 24px 26px;
          border-bottom: 1px solid #e5e1db;
        }

        .work-detail-section:last-child {
          border-bottom: 0;
        }

        .work-detail-copy {
          color: #5f5a54;
          font-size: 15px;
          line-height: 1.65;
          white-space: pre-wrap;
        }

        .deliverable-view-list {
          display: grid;
          gap: 9px;
        }

        .deliverable-view-row {
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr);
          gap: 12px;
          align-items: start;
          padding: 13px 14px;
          border: 1px solid #ddd8d0;
          border-radius: 11px;
          background: #fff;
        }

        .deliverable-view-number {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #f0eeea;
          color: #625d56;
          font-size: 11px;
          font-weight: 800;
        }

        .deliverable-view-main {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .deliverable-view-main strong {
          font-size: 14px;
        }

        .deliverable-view-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .deliverable-view-meta span {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          padding: 0 8px;
          border-radius: 999px;
          background: #f3f1ee;
          color: #625d56;
          font-size: 10px;
          font-weight: 700;
        }

        .deliverable-view-main small {
          color: #817b73;
          line-height: 1.45;
        }

        .work-link-list {
          display: grid;
          gap: 9px;
        }

        .work-link-card {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 13px;
          padding: 12px 13px;
          border: 1px solid #ddd8d0;
          border-radius: 11px;
          background: #fff;
          color: inherit;
          text-decoration: none;
        }

        .work-resource-visual {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 9px;
          background: #f0eeea;
        }

        .work-resource-visual svg {
          width: 18px;
          height: 18px;
        }

        .work-resource-visual img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .work-link-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .work-resource-type {
          color: #8c867e;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .work-link-copy small {
          overflow: hidden;
          color: #817b73;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .work-link-open {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border: 1px solid #ddd8d0;
          border-radius: 9px;
          background: #faf9f7;
        }

        .work-link-open svg {
          width: 15px;
          height: 15px;
        }

        .work-detail-empty {
          margin: 0;
          color: #918b83;
        }

        @media (max-width: 760px) {
          .work-detail-header {
            flex-direction: column;
          }

          .work-detail-tags {
            justify-content: flex-start;
          }

          .work-detail-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 520px) {
          .work-detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AdminShell>
  );
}

const toolbarStyles = `
  .work-detail-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 18px;
  }

  .work-detail-actions {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .work-detail-status {
    display: inline-flex;
    align-items: center;
    min-height: 36px;
    padding: 0 13px;
    border: 1px solid #d8d4cd;
    border-radius: 999px;
    background: #fff;
    font-size: 12px;
    font-weight: 700;
  }

  @media (max-width: 650px) {
    .work-detail-toolbar {
      align-items: stretch;
      flex-direction: column;
    }

    .work-detail-actions {
      display: grid;
      grid-template-columns: auto 1fr;
    }
  }
`;

function Detail({ label, value }) {
  return (
    <div className="work-detail-cell">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ResourceLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OpenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 5h5v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="m19 5-8 8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function parseDeliverables(value) {
  const text = String(value || "").trim();
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => ({
          name: String(item.name || ""),
          media_type:
            item.media_type === "video" || item.media_type === "document"
              ? item.media_type
              : "image",
          format: String(item.format || ""),
          ratio: String(item.ratio || ""),
          duration: String(item.duration || ""),
          quantity: String(item.quantity || "1"),
          notes: String(item.notes || ""),
        }))
        .filter(
          (item) => item.name || item.format || item.ratio || item.notes
        );
    }
  } catch {
    // Legacy field becomes one deliverable.
  }

  return [
    {
      name: "Primary Deliverable",
      media_type: "document",
      format: text,
      ratio: "",
      duration: "",
      quantity: "1",
      notes: "",
    },
  ];
}

function formatDeliverableCount(value) {
  const items = parseDeliverables(value);
  if (!items.length) return "Not specified";
  return `${items.length} deliverable${items.length === 1 ? "" : "s"}`;
}

function formatWorkFrom(value, teamOptions) {
  const slugs = Array.isArray(value) ? value : [];
  if (!slugs.length) return "Any team member";

  const names = slugs
    .map((slug) => teamOptions.find((member) => member.slug === slug)?.name)
    .filter(Boolean);

  return names.length ? names.join(", ") : "Selected team members";
}

function parseAttachmentItems(value) {
  const text = String(value || "").trim();
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => ({
          type: item.type === "image" ? "image" : "link",
          title: String(item.title || ""),
          url: cleanUrl(item.url),
        }))
        .filter((item) => item.url);
    }
  } catch {
    // Legacy links are handled below.
  }

  const matches =
    text.match(/https?:\/\/[^\s,]+/gi) ||
    text
      .split(/[\r\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);

  return matches
    .map((url, index) => ({
      type: "link",
      title: `Link ${index + 1}`,
      url: cleanUrl(url),
    }))
    .filter((item) => item.url);
}

function cleanUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    return new URL(normalized).toString();
  } catch {
    return "";
  }
}

function shortenLink(value) {
  try {
    const url = new URL(value);
    return `${url.hostname}${url.pathname === "/" ? "" : url.pathname}`;
  } catch {
    return value;
  }
}

function safeFormatDate(value) {
  if (!value) return "Not set";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Not set";

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTurnaround(value) {
  if (value === null || value === undefined || value === "") return "Not set";
  const days = Number(value);
  if (!Number.isFinite(days)) return "Not set";
  return `${days} day${days === 1 ? "" : "s"}`;
}

function formatRate(currency, amount) {
  if (amount === null || amount === undefined || amount === "") {
    return "Not set";
  }

  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) return "Not set";

  const code = currency === "USD" ? "USD" : "PHP";

  return new Intl.NumberFormat(code === "USD" ? "en-US" : "en-PH", {
    style: "currency",
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}
