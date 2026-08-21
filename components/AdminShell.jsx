import Image from "next/image";
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
          <Link
            href="/"
            className="admin-brand"
            aria-label="Floowp public website"
            style={{
              display: "inline-flex",
              alignItems: "center",
              lineHeight: 0,
            }}
          >
            <Image
              src="/floowp-wt.png"
              alt="Floowp"
              width={360}
              height={100}
              priority
              style={{
                width: "150px",
                height: "auto",
                display: "block",
                objectFit: "contain",
              }}
            />
          </Link>

          <span className="admin-badge">Admin</span>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
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
        </header>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
