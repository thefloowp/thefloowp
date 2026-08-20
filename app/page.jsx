import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import ProjectCard from "@/components/ProjectCard";
import TeamCard from "@/components/TeamCard";
import { projects } from "@/data/projects";
import { team } from "@/data/team";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-kicker">Collaborative marketing agency + creative studio</div>

        <div className="hero-wordmark" aria-label="Floowp">
          floowp
        </div>

        <div className="hero-bottom">
          <div>
            <p className="hero-tagline">Never Static.</p>
            <p className="muted">The Flow to Convert. The Loop to Scale.</p>
          </div>

          <div className="hero-motion">
            <span>Brands move.</span>
            <span>Culture moves.</span>
            <span>Commerce moves.</span>
            <strong>We move with it.</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="split-intro">
          <p className="eyebrow">What is Floowp?</p>
          <div>
            <h1 className="statement">
              We build brands that move — from launch to conversion, from
              conversion to scale.
            </h1>
            <Link className="text-link" href="/about">
              More about Floowp →
            </Link>
          </div>
        </div>
      </section>

      <section className="section border-top">
        <SectionTitle
          eyebrow="Selected Work"
          title="Work designed to keep moving."
          text="Strategy, creativity, commerce, and growth connected into one system."
        />
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard project={project} key={project.slug} />
          ))}
        </div>
      </section>

      <section className="section inverted">
        <SectionTitle
          eyebrow="Our Loop"
          title="Flow. Learn. Optimize. Scale."
          text="Floowp is built around continuous movement rather than one-off execution."
        />

        <div className="loop-grid">
          {["Strategy", "Create", "Launch", "Learn", "Optimize", "Scale"].map(
            (step, index) => (
              <div className="loop-item" key={step}>
                <span>0{index + 1}</span>
                <h3>{step}</h3>
              </div>
            )
          )}
        </div>
      </section>

      <section className="section">
        <SectionTitle
          eyebrow="The Collective"
          title="Different disciplines. One moving system."
          text="Meet the people behind the work."
        />
        <div className="team-grid">
          {team.map((member) => (
            <TeamCard member={member} key={member.slug} />
          ))}
        </div>
      </section>

      <section className="cta-band">
        <p className="eyebrow">Have something in motion?</p>
        <h2>Let’s make it Floowproof.</h2>
        <Link className="button-light" href="/contact">
          Start a project
        </Link>
      </section>
    </>
  );
}
