import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { getTaskHandoverItems } from "@/lib/taskHandover";

export const dynamic = "force-dynamic";

export default async function WorkDetailPage({ params }) {
  const { id } = await params;

  let item = null;
  let loadError = "";

  try {
    const items = await getTaskHandoverItems();
    item = items.find((entry) => String(entry.id) === String(id)) || null;
  } catch (error) {
    loadError = error?.message || "Unable to load this work item.";
  }

  if (loadError) {
    return (
      <AdminShell
        title="Work Details"
        subtitle="Unable to load this work item right now."
      >
        <div className="work-error-card">
          <strong>Could not load this work item.</strong>
          <p>{loadError}</p>
          <Link className="admin-btn admin-btn-secondary" href="/admin/tasks">
            ← Back to Work Intake
          </Link>
        </div>

        <style>{`
          .work-error-card {
            padding: 22px;
            border: 1px solid #e3b6ad;
            border-radius: 14px;
            background: #fff1ee;
            color: #8e2d20;
          }

          .work-error-card p {
            margin: 8px 0 18px;
            overflow-wrap: anywhere;
          }
        `}</style>
      </AdminShell>
    );
  }

  if (!item) {
    return (
      <AdminShell
        title="Work Not Found"
        subtitle="This work item may have been deleted or is no longer available."
      >
        <div className="work-not-found-card">
          <p>The requested work item could not be found.</p>
          <Link className="admin-btn admin-btn-secondary" href="/admin/tasks">
            ← Back to Work Intake
          </Link>
        </div>

        <style>{`
          .work-not-found-card {
            padding: 22px;
            border: 1px solid #ddd9d2;
            border-radius: 14px;
            background: #fff;
          }

          .work-not-found-card p {
            margin: 0 0 18px;
          }
        `}</style>
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

        <span className="work-detail-status">{item.status || "Unassigned"}</span>
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
          <Detail
            label="Request Date"
            value={safeFormatDate(item.start_date)}
          />
          <Detail
            label="Delivery Deadline"
            value={safeFormatDate(item.due_date)}
          />
          <Detail
            label="Turnaround"
            value={formatTurnaround(item.turnaround_days)}
          />
          <Detail
            label="Deliverable Format"
            value={item.required_file_type || "Not specified"}
          />
          <Detail
            label="Rate"
            value={formatRate(item.rate_currency, item.rate_amount)}
          />
        </div>

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
                  {attachment.type === "image" ? (
                    <div className="work-link-thumbnail">
                      <img
                        src={attachment.url}
                        alt={attachment.title || `Image ${index + 1}`}
                      />
                    </div>
                  ) : (
                    <div className="work-link-icon">↗</div>
                  )}

                  <span className="work-link-copy">
                    <strong>
                      {attachment.title ||
                        (attachment.type === "image"
                          ? `Image ${index + 1}`
                          : `Link ${index + 1}`)}
                    </strong>
                    <small>{shortenLink(attachment.url)}</small>
                  </span>

                  <span className="work-link-open">Open ↗</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="work-detail-empty">
              No client files or references.
            </p>
          )}
        </div>
      </section>

      <style>{`
        .work-detail-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 18px;
        }

        .work-detail-status {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 13px;
          border: 1px solid #d8d4cd;
          border-radius: 999px;
          background: #fff;
          font-size: 12px;
          font-weight: 700;
        }

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
          letter-spacing: .05em;
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

        .work-link-list {
          display: grid;
          gap: 10px;
        }

        .work-link-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 14px 15px;
          border: 1px solid #ddd8d0;
          border-radius: 12px;
          background: #faf9f7;
          color: inherit;
          text-decoration: none;
        }

        .work-link-thumbnail,
        .work-link-icon {
          width: 52px;
          height: 52px;
          flex: 0 0 52px;
          border-radius: 10px;
          overflow: hidden;
          background: #eeece8;
        }

        .work-link-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .work-link-icon {
          display: grid;
          place-items: center;
          font-size: 18px;
          font-weight: 700;
        }

        .work-link-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .work-link-copy small {
          overflow: hidden;
          max-width: 620px;
          color: #817b73;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .work-link-open {
          white-space: nowrap;
          font-weight: 700;
        }

        .work-detail-empty {
          margin: 0;
          color: #918b83;
        }

        @media (max-width: 760px) {
          .work-detail-header,
          .work-detail-toolbar {
            align-items: stretch;
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

          .work-link-card {
            align-items: flex-start;
            flex-direction: column;
          }

          .work-link-copy small {
            max-width: 100%;
            white-space: normal;
            overflow-wrap: anywhere;
          }
        }
      `}</style>
    </AdminShell>
  );
}

function Detail({ label, value }) {
  return (
    <div className="work-detail-cell">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
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
    // Legacy text is handled below.
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
  const raw = String(value || "")
    .trim()
    .replace(/[)\]}>.,;]+$/g, "");

  if (!raw) return "";

  const normalized = /^https?:\/\//i.test(raw)
    ? raw
    : `https://${raw}`;

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

  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTurnaround(value) {
  if (value === null || value === undefined || value === "") {
    return "Not set";
  }

  const days = Number(value);

  if (!Number.isFinite(days)) {
    return "Not set";
  }

  return `${days} day${days === 1 ? "" : "s"}`;
}

function formatRate(currency, amount) {
  if (amount === null || amount === undefined || amount === "") {
    return "Not set";
  }

  const numeric = Number(amount);

  if (!Number.isFinite(numeric)) {
    return "Not set";
  }

  const code = currency === "USD" ? "USD" : "PHP";

  return new Intl.NumberFormat(code === "USD" ? "en-US" : "en-PH", {
    style: "currency",
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}
