import Link from "next/link";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">About Floowp</p>
        <h1>Never Static.</h1>
        <p className="lead">
          Floowp is a collaborative marketing agency and creative studio built
          around one belief: brands should never stand still.
        </p>
      </section>

      <section className="section border-top">
        <div className="two-column">
          <div>
            <p className="eyebrow">The Name</p>
            <h2>Flow + Loop</h2>
          </div>
          <div className="prose">
            <p>
              <strong>Flow</strong> is how brands move from strategy to identity,
              from launch to content, and from attention to conversion.
            </p>
            <p>
              <strong>Loop</strong> is what happens next: learning, optimizing,
              refining, and scaling what works.
            </p>
          </div>
        </div>
      </section>

      <section className="section inverted">
        <div className="two-column">
          <div>
            <p className="eyebrow">Brand Belief</p>
            <h2>Movement is the system.</h2>
          </div>
          <div className="prose">
            <p>
              Brands evolve. Platforms evolve. Customers evolve. Floowp is built
              to adapt across all of them.
            </p>
            <p>
              We combine strategy, creativity, technology, and commerce into a
              connected way of working.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="two-column">
          <div>
            <p className="eyebrow">Brand Voice</p>
            <h2>We are Floowp.</h2>
          </div>
          <div className="prose">
            <p>
              We speak as one collaborative studio: clear, confident, adaptable,
              and focused on work that can grow.
            </p>
            <Link className="text-link" href="/team">
              Meet the collective →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
