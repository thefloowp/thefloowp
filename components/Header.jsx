import Image from "next/image";
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
      <Link className="brand-logo" href="/" aria-label="Floowp home">
        <Image
          src="/floowp-bk.png"
          alt="Floowp"
          width={320}
          height={90}
          priority
          className="brand-logo-image"
        />
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
