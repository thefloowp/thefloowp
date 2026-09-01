import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { getTaskHandoverItem } from "@/lib/taskHandover";

export const dynamic = "force-dynamic";

export default async function WorkDetailPage({ params }) {
  const { id } = await params;
  const item = await getTaskHandoverItem(id);

  if (!item) notFound();

  const links = extractLinks(item.attachment_links);

  return (
    <AdminShell
      title={item.title}
      subtitle="Client work details, requirements, files, ownership, and delivery information."
    >
      <div className="work-detail-toolbar">
        <Link className="admin-btn admin-btn-secondary" href="/admin/tasks">
          ← Back to Work Intake
        </Link>

        <span className="work-detail-status">{item.status}</span>
      </div>

      <section className="work-detail-card">
        <div className="work-detail-header">
          <div>
            <p className="work-detail-eyebrow">Client Work</p>
            <h2>{item.title}</h2>
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
            value={item.start_date ? formatDate(item.start_date) : "Not set"}
          />
          <Detail
            label="Delivery Deadline"
            value={item.due_date ? formatDate(item.due_date) : "Not set"}
          />
          <Detail
            label="Turnaround"
            value={
              item.turnaround_days === null ||
              item.turnaround_days === undefined
                ? "Not set"
                : `${item.turnaround_days} day${
                    Number(item.turnaround_days) === 1 ? "" : "s"
                  }`
            }
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

          {links.length ? (
            <div className="work-link-list">
              {links.map((link, index) => (
                <a
                  key={`${link}-${index}`}
                  className="work-link-card"
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    <strong>Reference {index + 1}</strong>
                    <small>{shortenLink(link)}</small>
                  </span>
                  <span>Open ↗</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="work-detail-empty">
              No attachment or reference links.
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
          text-decoration: none;
        }

        .work-link-card > span:first-child {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .work-link-card small {
          overflow: hidden;
          color: #817b73;
          text-overflow: ellipsis;
          white-space: nowrap;
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

function extractLinks(value) {
  const text = String(value || "").trim();
  if (!text) return [];

  const urls = text.match(/https?:\/\/[^\s,]+/gi);

  if (urls?.length) {
    return [...new Set(urls.map((url) => url.trim()))];
  }

  return text
    .split(/[\r\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => (/^https?:\/\//i.test(item) ? item : `https://${item}`));
}

function shortenLink(value) {
  try {
    const url = new URL(value);
    return `${url.hostname}${url.pathname === "/" ? "" : url.pathname}`;
  } catch {
    return value;
  }
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
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
