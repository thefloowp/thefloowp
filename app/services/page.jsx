import { serviceGroups } from "@/data/services";

export const metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Services</p>
        <h1>Built across the entire brand loop.</h1>
        <p className="lead">
          Floowp connects strategy, creative, digital, commerce, performance,
          and technology so the work does not stop at execution.
        </p>
      </section>

      <section className="section">
        <div className="service-list">
          {serviceGroups.map((group) => (
            <article className="service-row" key={group.number}>
              <span className="service-number">{group.number}</span>
              <h2>{group.title}</h2>
              <div className="service-items">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
