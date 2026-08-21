import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand-wrap">
        <Image
          src="/floowp-bk.png"
          alt="Floowp"
          width={300}
          height={84}
          className="footer-logo-image"
        />
        <p className="muted">Never Static.</p>
      </div>

      <div className="footer-right">
        <p>The Flow to Convert. The Loop to Scale.</p>
        <Link href="/contact">Start a project →</Link>
      </div>
    </footer>
  );
}
