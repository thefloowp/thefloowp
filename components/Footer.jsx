import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <p className="footer-brand">floowp</p>
        <p className="muted">Never Static.</p>
      </div>

      <div className="footer-right">
        <p>The Flow to Convert. The Loop to Scale.</p>
        <Link href="/contact">Start a project →</Link>
      </div>
    </footer>
  );
}
