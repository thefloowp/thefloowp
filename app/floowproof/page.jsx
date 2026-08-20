export const metadata = { title: "Floowproof" };

const principles = [
  ["01", "Clear.", "People immediately understand the brand."],
  ["02", "Consistent.", "Every platform feels unmistakably connected."],
  ["03", "Convertible.", "Creative does more than look good — it moves people."],
  ["04", "Scalable.", "The system can grow without losing identity."],
];

export default function FloowproofPage() {
  return (
    <>
      <section className="page-hero inverted-page">
        <p className="eyebrow">The Floowproof Standard</p>
        <h1>If it’s Floowproof, it just works.</h1>
        <p className="lead">
          Floowproof is our standard for making brands simple, clear, adaptable,
          and impossible to ignore.
        </p>
      </section>

      <section className="section">
        <div className="principle-grid">
          {principles.map(([number, title, text]) => (
            <article className="principle" key={number}>
              <span>{number}</span>
              <h2>{title}</h2>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
