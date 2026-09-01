import Link from "next/link";

const navItems = [
  ["Dashboard", "/admin"],
  ["Work Intake", "/admin/tasks"],
  ["Pages", "/admin/pages"],
  ["Projects", "/admin/projects"],
  ["Team", "/admin/team"],
  ["Services", "/admin/services"],
  ["Media Links", "/admin/media"],
  ["Site Settings", "/admin/settings"],
];

export default function AdminShell({ title, subtitle, children }) {
  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <div className="admin-title-group">
            <span className="admin-title">Admin</span>
            <span className="admin-badge">CMS</span>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <form action="/api/admin/logout" method="post">
            <button className="admin-logout-button" type="submit">
              Log out
            </button>
          </form>
          <Link href="/">View public site ↗</Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">Floowp CMS</p>
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        </header>

        <div className="admin-content">{children}</div>

        <style>{`
          .admin-sidebar-footer {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .admin-logout-button {
            appearance: none;
            border: 0;
            background: transparent;
            color: inherit;
            padding: 0;
            font: inherit;
            cursor: pointer;
            text-align: left;
          }
          .admin-logout-button:hover { text-decoration: underline; }
        `}</style>
      </div>
    </div>
  );
}
