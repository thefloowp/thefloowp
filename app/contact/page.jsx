export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <p className="eyebrow">Contact</p>
        <h1>Have something in motion?</h1>
        <p className="lead">Tell us what you’re building.</p>
      </section>

      <section className="section">
        <form className="contact-form">
          <label>
            <span>Name</span>
            <input type="text" name="name" placeholder="Your name" />
          </label>

          <label>
            <span>Company</span>
            <input type="text" name="company" placeholder="Company / Brand" />
          </label>

          <label>
            <span>Email</span>
            <input type="email" name="email" placeholder="you@company.com" />
          </label>

          <label className="full">
            <span>What do you need help with?</span>
            <textarea
              name="brief"
              rows="6"
              placeholder="Tell us about the brand, project, launch, or challenge."
            />
          </label>

          <button type="button">Start a Project →</button>
        </form>

        <p className="form-note">
          First-build note: this form is currently visual only. We can connect it
          to email, Forms, a CRM, or a database in the next build.
        </p>
      </section>
    </>
  );
}
