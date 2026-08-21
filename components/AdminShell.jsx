import Link from "next/link";

const navItems = [
  ["Dashboard", "/admin"],
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
          <Link href="/" className="admin-brand">
            floowp
          </Link>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="admin-nav">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
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

          <div className="admin-topbar-actions">
            <button className="admin-btn admin-btn-secondary" type="button">
              Preview
            </button>
            <button className="admin-btn admin-btn-primary" type="button">
              Save
            </button>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
