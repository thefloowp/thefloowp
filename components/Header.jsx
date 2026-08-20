import Link from "next/link";

const nav = [
  ["About", "/about"],
  ["Services", "/services"],
  ["Work", "/work"],
  ["Team", "/team"],
  ["Floowproof", "/floowproof"],
  ["Contact", "/contact"],
];

export default function Header() {
  return (
    <header className="site-header">
      <Link className="brand-mark" href="/" aria-label="Floowp home">
        floowp
      </Link>

      <nav className="main-nav" aria-label="Primary navigation">
        {nav.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
