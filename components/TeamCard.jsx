import Link from "next/link";

export default function TeamCard({ member }) {
  return (
    <Link className="team-card" href={`/team/${member.slug}`}>
      <div className="team-photo-placeholder">
        <span>{member.initials}</span>
      </div>
      <div className="team-meta">
        <div>
          <h3>{member.name}</h3>
          <p>{member.role}</p>
        </div>
        <span className="arrow">↗</span>
      </div>
    </Link>
  );
}
